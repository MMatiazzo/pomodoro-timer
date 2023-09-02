import { ReactNode, createContext, useReducer, useState } from 'react';

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
	amountSecondsPassed: number;
	setSecondsPassed: (seconds: number) => void;
	createNewCycle: (data: ICreateCycleData) => void;
	interruptCycle: () => void;
}

export const CycleContext = createContext({} as ICyclesContextType);

interface ICyclesContextProviderProps {
	children: ReactNode;
}

interface ICyclesState {
	cycles: ICycle[];
	activeCycleId: string | null;
}

export function CuclesContextProvider({
	children,
}: ICyclesContextProviderProps) {
	const [cyclesState, dispatch] = useReducer(
		(state: ICyclesState, action: any) => {
			switch (action.type) {
				case 'ADD_NEW_CYCLE':
					return {
						...state,
						cycles: [...state.cycles, action.payload.newCycle],
						activeCycleId: action.payload.newCycle.id,
					};

				case 'INTERRUPT_CURRENT_CYCLE':
					return {
						...state,
						cycles: state.cycles.map((cycle) => {
							if (cycle.id === state.activeCycleId) {
								return { ...cycle, interruptedDate: new Date() };
							}
							return cycle;
						}),
						activeCycleId: null,
					};

				case 'MARK_CURRENT_CYCLE_AS_FINISHED':
					return {
						...state,
						cycles: state.cycles.map((cycle) => {
							if (cycle.id === state.activeCycleId) {
								return { ...cycle, finishedDate: new Date() };
							}
							return cycle;
						}),
						activeCycleId: null,
					};

				default:
					return state;
			}
		},
		{
			cycles: [],
			activeCycleId: null,
		}
	);

	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

	const { cycles, activeCycleId } = cyclesState;

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

	function markCurrentCycleAsFinished() {
		dispatch({
			type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
			payload: { activeCycleId },
		});
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

		dispatch({ type: 'ADD_NEW_CYCLE', payload: { newCycle } });
		setAmountSecondsPassed(0);
	}

	function interruptCycle() {
		dispatch({
			type: 'INTERRUPT_CURRENT_CYCLE',
			payload: { activeCycleId },
		});
	}

	return (
		<CycleContext.Provider
			value={{
				cycles,
				activeCycle,
				activeCycleId,
				markCurrentCycleAsFinished,
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
