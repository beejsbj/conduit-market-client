// @deno-types="@types/react"

import Button from "@/components/Buttons/Button.tsx";

function App() {
  return (
    <div>
      <h1 className='text-purple-700'>Hello, Deno React!</h1>
      <Button variant='primary' size='md'>Hello, Button!</Button>
    </div>
  );
}

export default App;
