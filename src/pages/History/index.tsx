import { useContext } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { HistoryContainer, HistoryList, Status } from './styles';
import { CycleContext } from '../../context/CyclesContext';

export function History() {
	const { cycles } = useContext(CycleContext);

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
						{cycles.map((cycle) => (
							<tr key={cycle.id}>
								<td>{cycle.task}</td>
								<td>{cycle.minutesAmount} minutes</td>
								<td>
									{formatDistanceToNow(cycle.startDate, { addSuffix: true })}
								</td>
								<td>
									{cycle.finishedDate && (
										<Status statusColor="green">Concluded</Status>
									)}
									{cycle.interruptedDate && (
										<Status statusColor="red">Interrupeted</Status>
									)}
									{!cycle.finishedDate && !cycle.interruptedDate && (
										<Status statusColor="yellow">On Going</Status>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</HistoryList>
		</HistoryContainer>
	);
}
