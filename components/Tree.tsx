import * as DCL from 'decentraland-api'
import { ISceneryProps } from '../ts/SharedProperties';

export const Tree = (props: ISceneryProps) =>
{
	return (
		<gltf-model
			id={"tree" + props.position.x + props.position.z}
			position={props.position}
			src="assets/Tree.gltf"
			rotation={props.rotation}
			scale={props.scale}
		/>
	)
}