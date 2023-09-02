import { useContext, useEffect } from 'react';
import { CountdownContainer, SeparatorContainer } from './styles';
import { differenceInSeconds } from 'date-fns';
import { CycleContext } from '../../../../context/CyclesContext';

export function Countdown() {
	const {
		activeCycle,
		activeCycleId,
		markCurrentCycleAsFinished,
		amountSecondsPassed,
		setSecondsPassed,
	} = useContext(CycleContext);

	const totalSecondsCycle = activeCycle ? activeCycle.minutesAmount * 60 : 0;

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

	useEffect(() => {
		let interval: number;

		if (activeCycle) {
			interval = setInterval(() => {
				const actualDate = new Date();
				const startDate = activeCycle.startDate;
				const secondsDifference = differenceInSeconds(actualDate, startDate);

				if (secondsDifference >= totalSecondsCycle) {
					markCurrentCycleAsFinished();
					setSecondsPassed(totalSecondsCycle);
					clearInterval(interval);
				} else {
					setSecondsPassed(secondsDifference);
				}
			}, 1000);
		}

		return () => {
			clearInterval(interval);
		};
	}, [
		activeCycle,
		totalSecondsCycle,
		activeCycleId,
		markCurrentCycleAsFinished,
		setSecondsPassed,
	]);

	return (
		<CountdownContainer>
			<span>{minutes[0]}</span>
			<span>{minutes[1]}</span>
			<SeparatorContainer>:</SeparatorContainer>
			<span>{seconds[0]}</span>
			<span>{seconds[1]}</span>
		</CountdownContainer>
	);
}
