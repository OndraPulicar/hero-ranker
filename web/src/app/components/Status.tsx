type StatusProps = {
  type: 'INFO' | 'ERROR';
  children: React.ReactNode;
};

export default function Status({ type, children }: StatusProps) {
  let color = 'text-gray-300';

  if (type === 'ERROR') {
    color = 'text-red-400';
  }

  return <p className={`p-6 text-center ${color}`}>{children}</p>;
}
