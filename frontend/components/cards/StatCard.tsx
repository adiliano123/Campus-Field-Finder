interface Props {
  label: string;
  value: string | number;
  change?: string;
  gradient: string;
}

export default function StatCard({ label, value, change, gradient }: Props) {
  return (
    <div className={`rounded-xl p-5 ${gradient} relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_white_0%,_transparent_60%)]" />
      <p className="text-white/70 text-sm font-medium mb-3 relative">{label}</p>
      <p className="text-white text-3xl font-bold relative">{value}</p>
      {change && <p className="text-white/60 text-xs mt-2 relative">{change}</p>}
    </div>
  );
}
