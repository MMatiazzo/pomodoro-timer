import { useContext } from 'react';
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
import { CycleContext } from '../../context/CyclesContext';

const newCycleFormValidationSchema = zod.object({
	task: zod.string().min(5, 'Inform the task'),
	minutesAmount: zod.number().min(1).max(60),
});

type INewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
	const { createNewCycle, interruptCycle, activeCycle } =
		useContext(CycleContext);

	const newCycleForm = useForm<INewCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 5,
		},
	});

	const { handleSubmit, watch, reset } = newCycleForm;

	function handleCreateNewCycle(data: INewCycleFormData) {
		createNewCycle(data);
		reset();
	}

	const task = watch('task');
	const isSubmitDisabled = !task;

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
				<FormProvider {...newCycleForm}>
					<NewCycleForm />
				</FormProvider>
				<Countdown />
				{activeCycle ? (
					<StopCountdownButton onClick={interruptCycle} type="button">
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
