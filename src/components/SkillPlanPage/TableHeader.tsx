export const TableHeader = () => {
    return (
        <thead>
            <tr>
                <th></th> {/* For the remove button */}
                <th>From</th>
                <th>XP</th>
                <th>Method</th>
                <th>XP/Action</th>
                <th>Items</th>
                <th>Output</th>
                <th>Profit/Loss</th>
                <th>Time to Complete</th> {/* New column */}
            </tr>
        </thead>
    );
};