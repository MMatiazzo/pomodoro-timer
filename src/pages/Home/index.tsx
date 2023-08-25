import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { differenceInSeconds } from 'date-fns';

import { Play } from 'phosphor-react';

import {
	CountdownContainer,
	FormContainer,
	HomeContainer,
	MinutesAmountInput,
	SeparatorContainer,
	StartCountdownButton,
	TaskInput,
} from './styles';

const newCycleFormValidationSchema = zod.object({
	task: zod.string().min(1, 'Inform the task'),
	minutesAmount: zod.number().min(5).max(60),
});

type INewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface ICycle {
	id: string;
	task: string;
	minutesAmount: number;
	startDate: Date;
}

export function Home() {
	const [cycles, setCycles] = useState<ICycle[]>([]);
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

	useEffect(() => {
		if (activeCycle) {
			setInterval(() => {
				const actualDate = new Date();
				const startDate = activeCycle.startDate;
				setAmountSecondsPassed(differenceInSeconds(actualDate, startDate));
			}, 1000);
		}
	}, [activeCycle]);

	const { register, handleSubmit, watch, reset } = useForm<INewCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 5,
		},
	});

	function handleCreateNewCycle(data: INewCycleFormData) {
		const id = String(new Date().getTime());

		const newCycle: ICycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		};

		setCycles((state) => [...state, newCycle]);
		setActiveCycleId(id);

		reset();
	}

	const totalSecondsCycle = activeCycle ? activeCycle.minutesAmount * 60 : 0;
	const currentSeconds = activeCycle
		? totalSecondsCycle - amountSecondsPassed
		: 0;

	const minutesAmount = Math.floor(currentSeconds / 60);
	const secondsAmount = currentSeconds % 60;

	const minutes = String(minutesAmount).padStart(2, '0');
	const seconds = String(secondsAmount).padStart(2, '0');

	const task = watch('task');
	const isSubmitDisabled = !task;

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
				<FormContainer>
					<label htmlFor="task">I'll work on</label>
					<TaskInput
						id="task"
						type="text"
						placeholder="Give your project a name"
						list="task-suggestions"
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
						{...register('minutesAmount', { valueAsNumber: true })}
					/>

					<span>minutes.</span>
				</FormContainer>

				<CountdownContainer>
					<span>{minutes[0]}</span>
					<span>{minutes[1]}</span>
					<SeparatorContainer>:</SeparatorContainer>
					<span>{seconds[0]}</span>
					<span>{seconds[1]}</span>
				</CountdownContainer>

				<StartCountdownButton disabled={isSubmitDisabled} type="submit">
					<Play size={24} />
					Start
				</StartCountdownButton>
			</form>
		</HomeContainer>
	);
}
