import { ReactNode, createContext, useState } from 'react';

interface ICreateCycleData {
	task: string;
	minutesAmount: number;
}

interface ICycle {
	id: string;
	task: string;
	minutesAmount: number;
	startDate: Date;
	interruptedDate?: Date;
	finishedDate?: Date;
}

interface ICyclesContextType {
	cycles: ICycle[];
	activeCycle: ICycle | undefined;
	activeCycleId: string | null;
	markCurrentCycleAsFinished: () => void;
	resetActiveCycle: () => void;
	amountSecondsPassed: number;
	setSecondsPassed: (seconds: number) => void;
	createNewCycle: (data: ICreateCycleData) => void;
	interruptCycle: () => void;
}

export const CycleContext = createContext({} as ICyclesContextType);

interface ICyclesContextProviderProps {
	children: ReactNode;
}

export function CuclesContextProvider({
	children,
}: ICyclesContextProviderProps) {
	const [cycles, setCycles] = useState<ICycle[]>([]);
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

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

	function createNewCycle(data: ICreateCycleData) {
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
	}

	function interruptCycle() {
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

	return (
		<CycleContext.Provider
			value={{
				cycles,
				activeCycle,
				activeCycleId,
				markCurrentCycleAsFinished,
				resetActiveCycle,
				amountSecondsPassed,
				setSecondsPassed,
				createNewCycle,
				interruptCycle,
			}}
		>
			{children}
		</CycleContext.Provider>
	);
}
