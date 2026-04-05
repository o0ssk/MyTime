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
import { formatTime, getTaskDuration, parseTimeInput, splitTaskByPeriod } from '@/lib/timeUtils';

function TaskArcTooltip() {
  const { tasks, hoveredTaskId, getIsCompleted } = useTasks();

  if (!hoveredTaskId) return null;

  const task = tasks.find((t) => t.id === hoveredTaskId);
  if (!task) return null;

  const start = parseTimeInput(task.startTime);
  const end = parseTimeInput(task.endTime);

  // Position tooltip at the midpoint of the arc (original 24h span)
  const midTime =
    start < end
      ? (start + end) / 2
      : ((start + end + 24) / 2) % 24;

  const hour12 = ((midTime % 12) + 12) % 12;
  const fraction = hour12 / 12;
  const angle = Math.PI / 2 - fraction * Math.PI * 2;
  
  // Decide tooltip radius based on whether the midpoint is AM or PM
  const isAM = midTime < 12 || midTime >= 24;
  const radius = isAM ? 3.55 : 3.80;
  const x = Math.cos(angle) * (radius + 0.1); // Offset slightly for visibility
  const z = -Math.sin(angle) * (radius + 0.1);

  const duration = getTaskDuration(start, end);

  return (
    <Html
      position={[x, 0.6, z]} // Lowered slightly
      center
      style={{ pointerEvents: 'none', transition: 'opacity 0.2s ease' }}
    >
      <div
        style={{
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${task.color}AA`,
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
      </div>
    </Html>
  );
}

function TaskArcsGroup() {
  const { tasks, hoveredTaskId, setHoveredTaskId, getIsCompleted } = useTasks();

  // Create segments for all tasks
  const arcSegments = tasks.flatMap((task) => {
    const start = parseTimeInput(task.startTime);
    const end = parseTimeInput(task.endTime);
    
    return splitTaskByPeriod(start, end).map((segment, idx) => ({
      ...segment,
      taskId: task.id,
      color: task.color,
      isCompleted: getIsCompleted(task.id),
      key: `${task.id}-${segment.period}-${idx}`
    }));
  });

  return (
    <group>
      {arcSegments.map((seg) => (
        <TaskArc
          key={seg.key}
          taskId={seg.taskId}
          startTime={seg.start}
          endTime={seg.end}
          color={seg.color}
          isCompleted={seg.isCompleted}
          isHovered={hoveredTaskId === seg.taskId}
          // AM = Inner (3.55), PM = Outer (3.80)
          radius={seg.period === 'AM' ? 3.55 : 3.80}
          // AM = Higher (0.12), PM = Lower (0.08)
          y={seg.period === 'AM' ? 0.12 : 0.08}
          onPointerOver={() => setHoveredTaskId(seg.taskId)}
          onPointerOut={() => setHoveredTaskId(null)}
          onClick={() => {}}
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
