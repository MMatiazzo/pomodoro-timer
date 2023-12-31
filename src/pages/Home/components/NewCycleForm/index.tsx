import { useFormContext } from 'react-hook-form';
import { FormContainer, MinutesAmountInput, TaskInput } from './styles';
import { useContext } from 'react';
import { CycleContext } from '../../../../context/CyclesContext';

export function NewCycleForm() {
	const { register } = useFormContext();
	const { activeCycle } = useContext(CycleContext);

	return (
		<FormContainer>
			<label htmlFor="task">I'll work on</label>
			<TaskInput
				id="task"
				type="text"
				placeholder="Give your project a name"
				list="task-suggestions"
				disabled={!!activeCycle}
				{...register('task')}
			/>

			<datalist id="task-suggestions">
				<option value="Projeto 1" />
				<option value="Projeto 2" />
				<option value="Projeto 3" />
			</datalist>

			<label htmlFor="minutesAmount">for</label>
			<MinutesAmountInput
				id="minutesAmount"
				type="number"
				placeholder="00"
				step={5}
				min={5}
				max={60}
				disabled={!!activeCycle}
				{...register('minutesAmount', { valueAsNumber: true })}
			/>

			<span>minutes.</span>
		</FormContainer>
	);
}
