"use client";

interface Props {
  progress: number;
}

export default function ProgressRing({ progress }: Props) {
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#2a2a2a"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={
            progress === 0
              ? "#dc2626"
              : progress < 80
              ? "#22c55e"
              : "#facc15"
          }
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="22"
          fontWeight="bold"
        >
          {progress}%
        </text>
      </svg>

      {progress === 0 && (
        <p className="text-red-600 font-bold mt-2">
          YOU MISSED TODAY
        </p>
      )}

      {progress >= 80 && (
        <p className="text-yellow-400 font-semibold mt-2">
          🔥 You're on fire
        </p>
      )}
    </div>
  );
}