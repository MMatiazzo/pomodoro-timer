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

export function Home() {
	return (
		<HomeContainer>
			<form action="">
				<FormContainer>
					<label htmlFor="task">I'll work on</label>
					<TaskInput
						id="task"
						type="text"
						placeholder="Give your project a name"
						list="task-suggestions"
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
					/>

					<span>minutes.</span>
				</FormContainer>

				<CountdownContainer>
					<span>0</span>
					<span>0</span>
					<SeparatorContainer>:</SeparatorContainer>
					<span>0</span>
					<span>0</span>
				</CountdownContainer>

				<StartCountdownButton type="submit">
					<Play size={24} />
					Start
				</StartCountdownButton>
			</form>
		</HomeContainer>
	);
}
