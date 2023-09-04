import {
	ReactNode,
	createContext,
	useEffect,
	useReducer,
	useState,
} from 'react';
import {
	addNewCycleAction,
	interruptCurrentCycleAction,
	markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions';
import { ICycle, cyclesReducer } from '../reducers/cycles/reducer';
import { differenceInSeconds } from 'date-fns';

interface ICreateCycleData {
	task: string;
	minutesAmount: number;
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

export function CuclesContextProvider({
	children,
}: ICyclesContextProviderProps) {
	const [cyclesState, dispatch] = useReducer(
		cyclesReducer,
		{
			cycles: [],
			activeCycleId: null,
		},
		(initialState) => {
			const storageStateAsJson = localStorage.getItem(
				'@pomodoro-timer:cycles-state-1.0.0'
			);

			if (storageStateAsJson) {
				return JSON.parse(storageStateAsJson);
			}

			return initialState;
		}
	);

	const { cycles, activeCycleId } = cyclesState;
	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

	useEffect(() => {
		const stateJSON = JSON.stringify(cyclesState);

		localStorage.setItem('@pomodoro-timer:cycles-state-1.0.0', stateJSON);
	}, [cyclesState]);

	const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
		if (activeCycle) {
			const actualDate = new Date();
			const startDate = new Date(activeCycle.startDate);
			const secondsDifference = differenceInSeconds(actualDate, startDate);
			return secondsDifference;
		}

		return 0;
	});

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

		dispatch(addNewCycleAction(newCycle));
		setAmountSecondsPassed(0);
	}

	function interruptCycle() {
		dispatch(interruptCurrentCycleAction());
	}

	function markCurrentCycleAsFinished() {
		dispatch(markCurrentCycleAsFinishedAction());
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
