// ==========================================
// ClockScene — Scene Composition (v2)
// ==========================================

'use client';

import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import ClockFace from './ClockFace';
import ClockLabels from './ClockLabels';
import ClockCenter from './ClockCenter';
import ClockHands from './ClockHands';
import TaskArc from './TaskArc';
import { useTasks } from '@/app/context/TaskContext';
import { formatTime, getTaskDuration, parseTimeInput } from '@/lib/timeUtils';

function TaskArcTooltip() {
  const { tasks, hoveredTaskId, getIsCompleted } = useTasks();

  if (!hoveredTaskId) return null;

  const task = tasks.find((t) => t.id === hoveredTaskId);
  if (!task) return null;

  const start = parseTimeInput(task.startTime);
  const end = parseTimeInput(task.endTime);

  // Position tooltip at the midpoint of the arc
  const midTime =
    start < end
      ? (start + end) / 2
      : ((start + end + 24) / 2) % 24;

  const hour12 = ((midTime % 12) + 12) % 12;
  const fraction = hour12 / 12;
  const angle = Math.PI / 2 - fraction * Math.PI * 2;
  const radius = 3.47;
  const x = Math.cos(angle) * radius;
  const z = -Math.sin(angle) * radius;

  const duration = getTaskDuration(start, end);

  return (
    <Html
      position={[x, 0.8, z]}
      center
      style={{ pointerEvents: 'none', transition: 'opacity 0.2s ease' }}
    >
      <div
        style={{
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${task.color}44`,
          borderRadius: '12px',
          padding: '12px 18px',
          color: '#fafafa',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px ${task.color}22`,
          minWidth: '140px',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: getIsCompleted(task.id) ? '#22C55E' : task.color,
              flexShrink: 0,
            }}
          />
          <span>{task.title}</span>
          {getIsCompleted(task.id) && (
            <span style={{ color: '#22C55E', fontSize: 11 }}>✓</span>
          )}
        </div>
        <div style={{ color: '#a1a1aa', fontSize: 11 }}>
          {formatTime(start)} — {formatTime(end)} · {duration.toFixed(1)}h
        </div>
        {task.description && (
          <div
            style={{
              color: '#71717a',
              fontSize: 10,
              marginTop: 4,
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {task.description}
          </div>
        )}
      </div>
    </Html>
  );
}

function TaskArcsGroup() {
  const { tasks, hoveredTaskId, setHoveredTaskId, getIsCompleted } = useTasks();

  return (
    <group>
      {tasks.map((task) => (
        <TaskArc
          key={task.id}
          taskId={task.id}
          startTime={parseTimeInput(task.startTime)}
          endTime={parseTimeInput(task.endTime)}
          color={task.color}
          isCompleted={getIsCompleted(task.id)}
          isHovered={hoveredTaskId === task.id}
          onPointerOver={() => setHoveredTaskId(task.id)}
          onPointerOut={() => setHoveredTaskId(null)}
          onClick={() => {}} // Not hooked for now
        />
      ))}
    </group>
  );
}

export default function ClockScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[3, 10, 5]}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <pointLight position={[-4, 6, -2]} intensity={0.6} color="#cbd5e1" />
      <pointLight position={[4, 4, 4]} intensity={0.4} color="#6366F1" />
      <pointLight position={[0, 8, 0]} intensity={0.5} color="#ffffff" />
      <spotLight
        position={[0, 12, 0]}
        intensity={0.6}
        angle={0.4}
        penumbra={0.8}
        castShadow
        color="#ffffff"
      />

      {/* High-quality local lighting to replace environment maps */}
      <hemisphereLight intensity={0.4} color="#f8fafc" groundColor="#0f172a" />
      {/* <Environment preset="night" /> */}

      {/* The Ethereal Observer: Centered Focus */}
      <group position={[0, 0, 0]}>
        {/* Clock face (body + bezel) */}
        <ClockFace />

        {/* Hour labels + tick marks */}
        <ClockLabels />

        {/* Task arcs on outer ring */}
        <TaskArcsGroup />

        {/* Clock hands */}
        <ClockHands />

        {/* Center hub cap */}
        <ClockCenter />

        {/* Orbit Ground Shadow (Ambient Shadows tinted with Gold) */}
        <ContactShadows
          opacity={0.05} 
          scale={15} 
          blur={3} 
          far={10} 
          resolution={1024} 
          color="#000000" 
        />
      </group>

      {/* Hover tooltip */}
      <TaskArcTooltip />

      {/* Orbit controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={16}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.2}
        dampingFactor={0.05}
        enableDamping
        autoRotate={false}
        makeDefault
      />
    </>
  );
}
