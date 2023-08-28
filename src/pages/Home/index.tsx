import { createContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { HandPalm, Play } from 'phosphor-react';

import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from './styles';
import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown';

const newCycleFormValidationSchema = zod.object({
	task: zod.string().min(5, 'Inform the task'),
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

interface ICyclesContextType {
	activeCycle: ICycle | undefined;
	activeCycleId: string | null;
	markCurrentCycleAsFinished: () => void;
	resetActiveCycle: () => void;
	amountSecondsPassed: number;
	setSecondsPassed: (seconds: number) => void;
}

export const CycleContext = createContext({} as ICyclesContextType);

export function Home() {
	const [cycles, setCycles] = useState<ICycle[]>([]);
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

	const newCycleForm = useForm<INewCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 5,
		},
	});

	const { handleSubmit, watch, reset } = newCycleForm;

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

	function markCurrentCycleAsFinished() {
		setCycles((state) =>
			state.map((cycle) => {
				if (cycle.id === activeCycleId) {
					return { ...cycle, finishedDate: new Date() };
				}
				return cycle;
			})
		);
	}

	function resetActiveCycle() {
		setActiveCycleId(null);
	}

	function setSecondsPassed(seconds: number) {
		setAmountSecondsPassed(seconds);
	}

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

	const task = watch('task');
	const isSubmitDisabled = !task;

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
				<CycleContext.Provider
					value={{
						activeCycle,
						activeCycleId,
						markCurrentCycleAsFinished,
						resetActiveCycle,
						amountSecondsPassed,
						setSecondsPassed,
					}}
				>
					<FormProvider {...newCycleForm}>
						<NewCycleForm />
					</FormProvider>
					<Countdown />
				</CycleContext.Provider>
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
