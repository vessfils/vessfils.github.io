/* CUB3D visuals. Every frame was rendered by the project's own ray caster, compiled unchanged
 * against a headless MiniLibX stand-in that saves each image instead of opening a window
 * (see README › "Where the figures come from"). */
import { Img } from '../components/ui/Img'
import { AnimatedCapture } from './primitives/AnimatedCapture'
import { Flow } from './primitives/Flow'
import { Frame } from './primitives/Frame'

function Spin({ className = '' }: { className?: string }) {
  return (
    <AnimatedCapture
      animation="/media/cub3d/spin.webp"
      still="cub3d/corridor"
      alt="The player turning a full circle in the subject map; the second turn shows the minimap and the cast rays"
      size={400}
      className={className}
    />
  )
}

export function Cub3dGameplay() {
  const stills = [
    { src: 'cub3d/corridor', alt: 'Long corridor with differently textured side walls', label: 'Corridor' },
    { src: 'cub3d/corner', alt: 'Corner where two wall textures meet', label: 'Corner' },
    { src: 'cub3d/minimap', alt: 'Minimap with the player and the cast rays drawn in yellow', label: 'Minimap + rays (M, L)' },
  ]
  return (
    <Frame label="Engine output" source="Real frames, project code, headless capture">
      <div className="grid gap-6 md:grid-cols-[minmax(0,340px)_1fr] md:items-start">
        <Spin className="mx-auto aspect-square w-full max-w-[340px] overflow-hidden rounded-md" />
        <div>
          <p className="text-sm text-muted">
            The player turns a full circle in the subject map, then turns again with the minimap (M) and the ray overlay (L) switched on. Each wall
            orientation has its own texture, which makes the projection easy to read.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {stills.map((s) => (
              <figure key={s.src}>
                <Img src={s.src} alt={s.alt} sizes="140px" className="aspect-square w-full rounded" />
                <figcaption className="mt-1 text-center text-[0.68rem] text-faint">{s.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  )
}

export function Cub3dCover() {
  return (
    <div className="flex h-full items-center justify-center bg-black p-3">
      <Spin className="aspect-square h-full" />
    </div>
  )
}

export function Cub3dPipeline() {
  return (
    <Frame label="One frame" source="srcs/">
      <Flow
        steps={[
          { title: 'Parse .cub', detail: 'Textures, floor and ceiling colours, map closed by walls, one start position.', meta: 'parsing/' },
          { title: 'Input', detail: 'W/S move, A/D turn, E opens doors, M and L toggle the minimap and rays.', meta: 'handler.c' },
          { title: 'Cast 720 rays', detail: 'One per screen column; nearest of the horizontal and vertical grid hits.', meta: 'castrays/', focus: true },
          { title: 'Project walls', detail: 'Fish-eye corrected distance → strip height; texture column by hit position.', meta: 'render.c' },
          { title: 'Present', detail: 'The frame is drawn into an image, then pushed to the window once.', meta: 'game.c' },
        ]}
      />
    </Frame>
  )
}
