const config = require('./config.json');
import * as DCL from 'decentraland-api';
import { Vector3Component } from 'decentraland-api';
import * as SceneHelper from 'ts/SceneHelper';
import { Dog } from 'components/Dog';
import { Cat } from 'components/Cat';
import { Mouse } from 'components/Mouse';
import { Cheese } from 'components/Cheese';
import { Entrance } from 'components/Entrance';
import { IAnimalProps, ISceneryProps, AnimalType, AnimationType, IBaitProps, BaitType } from 'ts/SharedProperties';
import { Exit } from 'components/Exit';
import { Tree } from 'components/Tree';
import { House } from 'components/House';
import { Fence } from 'components/Fence';
import { Ground } from 'components/Ground';
import { Catnip } from 'components/Catnip';
import { sleep, add, approxEquals } from 'ts/MathHelper';
import { Grid } from 'ts/Grid';
import { EventManager } from 'ts/EventManager';
import { AnimalStateMachine } from 'ts/StateMachine/AnimalStateMachine';
import { StateEat } from 'ts/StateMachine/StateEat';
import { StatePatrol } from 'ts/StateMachine/StatePatrol';
import { StateGoTo } from 'ts/StateMachine/StateGoTo';
import { StateDespawn } from 'ts/StateMachine/StateDespawn';
import { FenceCorner } from 'components/FenceCorner';
import { FenceSpinner, SpinState } from 'components/FenceSpinner';


export default class DogCatMouseCheese extends DCL.ScriptableScene
{
	// Data
	baitType: keyof typeof BaitType = config.baitType;
	state: {
		
		animals: IAnimalProps[],
		trees: ISceneryProps[],
		fenceSpinState: SpinState[],
		baitProps: IBaitProps,
	
	} = {
			
			animals: [],
			trees: [],
			fenceSpinState: [SpinState.None, SpinState.None],
			baitProps: {
				id: config.baitType,
				position: { x: 21, y: 0, z: 5 },
				isVisible: true,
				isDoorClosed: true,
				baitType: BaitType[this.baitType]
			},
		};
	objectCounter = 0;

	// Init
	sceneDidMount()
	{
		EventManager.init(this.eventSubscriber);
		Grid.init(30, 30);
		SceneHelper.updateGridWithStaticScenery();
		Grid.set(this.state.baitProps.position);
		this.spawnTrees();
		//this.renderGrid(); // for testing

		this.eventSubscriber.on("Entrance_click", e => this.onEntranceClick());
		this.eventSubscriber.on("House_click", e => this.onHouseClick());
		this.eventSubscriber.on("door_click", () => {this.setState({ isDoorClosed: !this.state.isDoorClosed })});
		this.eventSubscriber.on('renderAnimals', e => this.onRenderAnimals());
		this.eventSubscriber.on('captureBait', e => this.onCaptureBait());
		this.eventSubscriber.on('despawn', (animalId, delay) => this.onDespawn(animalId, delay));
		this.eventSubscriber.on('gridCellSet', cell => this.onGridCellSet(cell));
	}
	spawnTrees()
	{
		let trees: ISceneryProps[] = [];
		const range = config.trees.max - config.trees.min;
		let counter = 0;
		for (let i = 0; i < Math.random() * range + config.trees.min; i++)
		{
			let position;
			do
			{
				position = Grid.randomPosition(2, true);
				if (counter++ > 500)
				{ // Don't get stuck working too hard
					break;
				}
			} while (!Grid.hasClearance(position, 4));
			Grid.set(position);

			trees.push({
				position,
				rotation: { x: 0, y: Math.random() * 360, z: 0 },
				scale: { x: 1, y: Math.random() * .4 + 1, z: 1 }
			});
		}
		this.setState({ trees });
	}
	renderGrid()
	{
		let trees: ISceneryProps[] = [];
		for (let x = 0; x < 30; x++)
		{
			for (let z = 0; z < 30; z++)
			{
				let position = { x, y: 0, z };
				if (Grid.isAvailable(position))
				{
					continue;
				}

				trees.push({
					position,
					rotation: { x: 0, y: Math.random() * 360, z: 0 },
					scale: { x: 1, y: Math.random() * .4 + 1, z: 1 }
				});
			}
		}
		this.setState({ trees });
	}
	
	// Events
	onEntranceClick()
	{ // Spawn prey
		const animalProps = this.spawnAnimal(
			config.prey.animalType,
			SceneHelper.entranceProps.position,
			add(SceneHelper.entranceProps.position, { x: 1, y: 0, z: 0 }),
			config.prey.sneakSpeed);
		if (animalProps)
		{
			AnimalStateMachine.pushStates([
				new StateDespawn(animalProps, {delay: 1000}),
				new StateGoTo(animalProps, SceneHelper.exitProps, config.prey.exitConfig, config.prey.blockedConfig),
				new StateEat(animalProps, this.state.baitProps, config.prey.eatConfig, config.prey.blockedConfig),
			]);
		}
	}
	onHouseClick()
	{ // Spawn predator
		const animalProps = this.spawnAnimal(
			config.predator.animalType,
			SceneHelper.houseProps.position,
			add(SceneHelper.houseProps.position, { x: 0, y: 0, z: -1 }),
			config.predator.patrolSpeed);
		if (animalProps)
		{
			AnimalStateMachine.pushState(new StatePatrol(
				animalProps,
				SceneHelper.houseProps,
				config.predator.patrolConfig
			));
		}
	}
	onRenderAnimals()
	{
		this.setState({ animals: this.state.animals });
	}
	async onCaptureBait()
	{
		await sleep(750);
		this.state.baitProps.isVisible = false;
		this.setState({ baitProps: this.state.baitProps });
		await sleep(2000);
		this.state.baitProps.isVisible = true;
		this.setState({ baitProps: this.state.baitProps });
	}
	async onDespawn(animalId: string, delay: number)
	{
		const animal = this.state.animals.find(a => a.id == animalId);
		if (animal)
		{
			AnimalStateMachine.terminate(animalId);
			animal.isDead = true;
			await sleep(delay);
			Grid.clear(animal.position);
			this.setState({ animals: this.state.animals.filter((a) => a.id != animal.id) });
		}
	}
	async onGridCellSet(position: Vector3Component)
	{
		let index = -1;
		for (let i = 0; i < SceneHelper.fenceSpinnerProps.length; i++)
		{
			if (approxEquals(position, SceneHelper.fenceSpinnerProps[i].position))
			{
				index = i;
				break;
			}
		}
		if (index >= 0)
		{
			let fenceSpinState = this.state.fenceSpinState.slice();
			if (fenceSpinState[index] != SpinState.None)
			{ // One at a time to keep the animation timing
				return;
			}
			// Note this is not always correct..
			fenceSpinState[index] = index == 0 ? SpinState.Enter : SpinState.Exit; 
			this.setState({ fenceSpinState });
			await sleep(75 * 1000 / 25);
			fenceSpinState = this.state.fenceSpinState.slice();
			fenceSpinState[index] = SpinState.None;
			this.setState({ fenceSpinState });
		}
	}

	// Helper methods
	spawnAnimal(animalKey: keyof typeof AnimalType,
		position: Vector3Component,
		lookAtPosition: Vector3Component,
		moveDuration: number): IAnimalProps | null
	{
		if (!Grid.isAvailable(position))
		{ // Space is occupied, can't spawn
			return null;
		}
		Grid.set(position);

		const animal: IAnimalProps = {
			id: "Animal" + this.objectCounter++,
			animalType: AnimalType[animalKey],
			position,
			lookAtPosition,
			moveDuration,
			animationWeights: [
				{ animation: AnimationType.Idle, weight: 1 },
				{ animation: AnimationType.Walk, weight: 0 },
				{ animation: AnimationType.Drink, weight: 0 },
				{ animation: AnimationType.Dead, weight: 0 },
				{ animation: AnimationType.Run, weight: 0 },
				{ animation: AnimationType.Sit, weight: 0 },
			],
			isDead: false,
			scale: 1,
		};
		this.setState({ animals: [...this.state.animals, animal] });
		return animal;
	}

	// Render
	renderTrees()
	{
		return this.state.trees.map((tree) =>
		{
			return Tree(tree);
		});
	}
	renderFence()
	{
		return SceneHelper.fenceProps.map((fence) =>
		{
			return Fence(fence);
		});
	}
	renderFenceCorners()
	{
		return SceneHelper.fenceCornerProps.map((fenceCorner) =>
		{
			return FenceCorner(fenceCorner);
		});
	}
	renderFenceSpinners()
	{
		return SceneHelper.fenceSpinnerProps.map((fenceSpinner, index) =>
		{
			return FenceSpinner({ id: index, sceneProps: fenceSpinner, spinState: this.state.fenceSpinState[index] });
		});
	}
	renderBait()
	{
		if (this.state.baitProps.baitType == BaitType.Cheese)
		{
			return Cheese(this.state.baitProps)
		}
		else
		{
			return Catnip(this.state.baitProps);
		}
	}
	renderAnimals()
	{
		return this.state.animals.map((animal) =>
		{
			switch (animal.animalType)
			{
				case AnimalType.Mouse:
					return Mouse(animal);
				case AnimalType.Cat:
					return Cat(animal);
				case AnimalType.Dog:
					return Dog(animal);
			}
		});
	}
	async render()
	{
		const doorRotation = {
			x: this.state.isDoorClosed ? -20 : 0,
			y: 90,
			z: 0,

		}

		return (
			<scene>
				<entity
				
					rotation={doorRotation}
					transition={{ rotation: { duration: 1000, timing: "ease-in" } }}
		 		 >
				<box
					  id="door"
			 	      scale={{ x: 1.7, y: 2.7, z: 0.05 }}
				      position={{ x: -11, y: 1.5, z: 9 }}
			          color="#774903"
			    />
		        </entity>
				{Ground(SceneHelper.groundProps)}
				{Entrance(SceneHelper.entranceProps)}
				{Exit(SceneHelper.exitProps)}
				{House(SceneHelper.houseProps)}
				{this.renderBait()}
				{this.renderAnimals()}
				{this.renderTrees()}
				{this.renderFence()}
				{this.renderFenceCorners()}
				{this.renderFenceSpinners()}
			</scene>
		)
	}
}