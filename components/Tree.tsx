import * as DCL from 'metaverse-api'
import { ISceneryProps } from '../ts/SharedProperties';

export const Tree = (props: ISceneryProps) =>
{
	return (
		<gltf-model
			position={props.position}
			src="assets/BlobMonster/BlobMonster.gltf"
			rotation={props.rotation}
		/>
	)
}