function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <div className="w-10 h-10 border-4 border-black border-t-white rounded-full animate-spin" />
      <p className="text-sm text-gray-600 text-center p-1">
        Generating Room code
        <br />
        Please do not refresh
      </p>
    </div>
  );
}
export default Spinner;
