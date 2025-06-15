import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Home } from 'lucide-react';
import styles from './Sidebar.module.css';
import { useAppSelector } from '../../store/store';
import { xpToLevel } from '../../utils/xpCalculations';

// Define the skills available in the game
const skills = [
  'Attack', 'Strength', 'Defence', 'Ranged', 'Prayer', 'Magic', 'Runecraft',
  'Construction', 'Hitpoints', 'Agility', 'Herblore', 'Thieving', 'Crafting',
  'Fletching', 'Slayer', 'Hunter', 'Mining', 'Smithing', 'Fishing', 'Cooking',
  'Firemaking', 'Woodcutting', 'Farming'
];

const Sidebar: React.FC = () => {
  const [skillsOpen, setSkillsOpen] = useState(false);
  const characters = useAppSelector(state => state.characterReducer);

  // Get the last character data
  const lastCharacter = useMemo(() => {
    const last = Object.entries(characters).sort(([, a], [, b]) => b.lastUpdated - a.lastUpdated).at(0);
    if (last !== undefined) {
      return {
        ...last[1],
        username: last[0]
      };
    }
    return null;
  }, [characters]);

  // Separate skills into maxed and non-maxed
  const { maxedSkills, nonMaxedSkills } = useMemo(() => {
    if (!lastCharacter) {
      return { maxedSkills: [], nonMaxedSkills: [...skills].sort((a, b) => a.localeCompare(b)) };
    }

    const maxed: string[] = [];
    const nonMaxed: string[] = [];

    skills.forEach(skill => {
      const skillData = lastCharacter[skill as keyof typeof lastCharacter];
      if (skillData) {
        const lastEpoch = Math.max(...Object.keys(skillData as Record<string, number>).map(Number));
        const currentXp = (skillData as Record<string, number>)[lastEpoch] || 0;
        const level = xpToLevel(currentXp);
        
        if (level >= 99) {
          maxed.push(skill);
        } else {
          nonMaxed.push(skill);
        }
      } else {
        nonMaxed.push(skill);
      }
    });


    return { 
      maxedSkills: maxed.sort((a, b) => a.localeCompare(b)), 
      nonMaxedSkills: nonMaxed.sort((a, b) => a.localeCompare(b)) 
    };
  }, [lastCharacter]);

  const toggleSkills = () => {
    setSkillsOpen(!skillsOpen);
  };

  const renderSkillLink = (skill: string) => (
    <Link 
      key={skill} 
      to={`/skill/${skill.toLowerCase()}`} 
      className={styles.skillItem}
    >
      <img 
        src={`/images/skills/${skill.toLowerCase()}.png`} 
        alt={`${skill} icon`} 
        className={styles.skillIcon}
      />
      <span>{skill}</span>
    </Link>
  );

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>OSRS Maxing Guide</h2>
      </div>
      
      <nav className={styles.navigation}>
        <Link to="/" className={styles.navItem}>
          <Home size={18} />
          <span>Home</span>
        </Link>
        
        <div className={styles.dropdownContainer}>
          <button 
            className={styles.dropdownButton} 
            onClick={toggleSkills}
          >
            <span>Skills</span>
            {skillsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {skillsOpen && (
            <div className={styles.dropdownContent}>
              {/* Non-maxed skills */}
              {nonMaxedSkills.map(renderSkillLink)}
              
              {/* Maxed skills section (only show if there are maxed skills) */}
              {maxedSkills.length > 0 && (
                <>
                  <div className={styles.maxedHeader}>Maxed</div>
                  {maxedSkills.map(renderSkillLink)}
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;