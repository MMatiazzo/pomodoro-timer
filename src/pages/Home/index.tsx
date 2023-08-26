import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { differenceInSeconds } from 'date-fns';

import { HandPalm, Play } from 'phosphor-react';

import {
	CountdownContainer,
	FormContainer,
	HomeContainer,
	MinutesAmountInput,
	SeparatorContainer,
	StartCountdownButton,
	StopCountdownButton,
	TaskInput,
} from './styles';

const newCycleFormValidationSchema = zod.object({
	task: zod.string().min(1, 'Inform the task'),
	minutesAmount: zod.number().min(1).max(60),
});

type INewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface ICycle {
	id: string;
	task: string;
	minutesAmount: number;
	startDate: Date;
	interruptedDate?: Date;
	finishedDate?: Date;
}

export function Home() {
	const [cycles, setCycles] = useState<ICycle[]>([]);
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
	const totalSecondsCycle = activeCycle ? activeCycle.minutesAmount * 60 : 0;

	useEffect(() => {
		let interval: number;

		if (activeCycle) {
			interval = setInterval(() => {
				const actualDate = new Date();
				const startDate = activeCycle.startDate;
				const secondsDifference = differenceInSeconds(actualDate, startDate);

				if (secondsDifference >= totalSecondsCycle) {
					setCycles((state) =>
						state.map((cycle) => {
							if (cycle.id === activeCycleId) {
								return { ...cycle, finishedDate: new Date() };
							}
							return cycle;
						})
					);

					setAmountSecondsPassed(totalSecondsCycle);
					clearInterval(interval);
					setActiveCycleId(null);
				} else {
					setAmountSecondsPassed(secondsDifference);
				}
			}, 1000);
		}

		return () => {
			clearInterval(interval);
		};
	}, [activeCycle, totalSecondsCycle, activeCycleId]);

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
		setAmountSecondsPassed(0);

		reset();
	}

	function handleInterruptCycle() {
		setCycles((state) =>
			state.map((cycle) => {
				if (cycle.id === activeCycleId) {
					return { ...cycle, interruptedDate: new Date() };
				}
				return cycle;
			})
		);

		setActiveCycleId(null);
	}

	const currentSeconds = activeCycle
		? totalSecondsCycle - amountSecondsPassed
		: 0;

	const minutesAmount = Math.floor(currentSeconds / 60);
	const secondsAmount = currentSeconds % 60;

	const minutes = String(minutesAmount).padStart(2, '0');
	const seconds = String(secondsAmount).padStart(2, '0');

	useEffect(() => {
		if (activeCycle) document.title = `${minutes}:${seconds}`;
	}, [minutes, seconds, activeCycle]);

	const task = watch('task');
	const isSubmitDisabled = !task;

	console.log(cycles);

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
						min={1}
						max={60}
						disabled={!!activeCycle}
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

				{activeCycle ? (
					<StopCountdownButton onClick={handleInterruptCycle} type="button">
						<HandPalm size={24} />
						Stop
					</StopCountdownButton>
				) : (
					<StartCountdownButton disabled={isSubmitDisabled} type="submit">
						<Play size={24} />
						Start
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	);
}
