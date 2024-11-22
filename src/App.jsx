function App() {
  return (
    <div className="h-screen w-screen dark:bg-black bg-white font-sans dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="w-full inline-flex items-center justify-center p-2 text-center font-medium relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Nice to see you here! Hope you're having a great day!
      </p>
    </div>
  );
}

export default App;
