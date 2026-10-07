type StatusProps = {
  type: 'INFO' | 'ERROR';
  info: string;
};

export default function Status({ type, info }: StatusProps) {
  let color = 'text-gray-300';

  if (type === 'ERROR') {
    color = 'text-red-400';
  }

  return <p className={`p-6 text-center ${color}`}>{info}</p>;
}
