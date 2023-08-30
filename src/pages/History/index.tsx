// import { useContext } from 'react';
import { HistoryContainer, HistoryList, Status } from './styles';
// import { CycleContext } from '../../context/CyclesContext';

export function History() {
	// const { cycles } = useContext(CycleContext);
	// utilize cycles on history

	return (
		<HistoryContainer>
			<h1>My History</h1>
			<HistoryList>
				<table>
					<thead>
						<tr>
							<th>Task</th>
							<th>Duration</th>
							<th>Start</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Task 1</td>
							<td>20 minutes</td>
							<td>2 months from now</td>
							<td>
								<Status statusColor="green">Concluded</Status>
							</td>
						</tr>
						<tr>
							<td>Task 1</td>
							<td>20 minutes</td>
							<td>2 months from now</td>
							<td>
								<Status statusColor="green">Concluded</Status>
							</td>
						</tr>
						<tr>
							<td>Task 1</td>
							<td>20 minutes</td>
							<td>2 months from now</td>
							<td>
								<Status statusColor="red">Failed</Status>
							</td>
						</tr>
						<tr>
							<td>Task 1</td>
							<td>20 minutes</td>
							<td>2 months from now</td>
							<td>
								<Status statusColor="yellow">On Going</Status>
							</td>
						</tr>
						<tr>
							<td>Task 1</td>
							<td>20 minutes</td>
							<td>2 months from now</td>
							<td>
								<Status statusColor="yellow">On Going</Status>
							</td>
						</tr>
					</tbody>
				</table>
			</HistoryList>
		</HistoryContainer>
	);
}
