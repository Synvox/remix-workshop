export function Button({ ...props }: JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      className="active:border-b-1 h-10 rounded-md border border-b-2 border-blue-600 bg-gradient-to-b from-sky-500 from-10% to-blue-500 px-5 font-medium text-white active:bg-blue-600 active:bg-none active:text-opacity-50"
    />
  );
}
