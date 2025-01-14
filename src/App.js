import React, { useRef, useEffect } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null); // Reference to the canvas element

  // Pendulum parameters
  const length = 350;  // Length of the pendulum arm (in pixels)
  const gravity = 0.4;  // Gravity constant (adjust for visual effect)
  const damping = 0.995;  // Damping coefficient (reduce this value to increase damping)
  var pendulumX = 0; // penulum x position
  var pendulumY = 0; // penulum y position
  const radius = 10; // radius of bob

  // Initial conditions for the pendulum
  let angle = Math.PI / 2;  // Starting angle (90 degrees)
  let angleVelocity = 0;  // Initial angular velocity (starts at 0)
  let angleAcceleration = 0;  // Initial angular acceleration (starts at 0)

  // Function to run the animation loop
  const animate = () => {
    const canvas = canvasRef.current; // Get canvas reference
    const ctx = canvas.getContext('2d'); // Get 2D drawing context

    // Calculate the angular acceleration based on the current angle
    // Formula: angular acceleration = (-gravity / length) * sin(angle)
    angleAcceleration = (-gravity / length) * Math.sin(angle);
    angleVelocity += angleAcceleration;  // Update angular velocity based on acceleration

    // Apply damping to the angular velocity to simulate energy loss
    angleVelocity *= damping;  // Reduce the angular velocity by the damping factor

    angle += angleVelocity;  // Update the angle based on velocity

    // Clear the canvas before drawing the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPendulum(ctx);  // Call the function to draw the pendulum

    // Request the next animation frame to create a smooth loop
    requestAnimationFrame(animate); 
  };

  // Function to draw the pendulum on the canvas
  const drawPendulum = (ctx) => {
    const originX = canvasRef.current.width / 2; // X position of the pendulum's origin (center of canvas)
    const originY = 100;  // Y position of the pendulum's origin (fixed point)

    // Calculate the position of the pendulum bob (ball) using the current angle
    pendulumX = originX + length * Math.sin(angle);
    pendulumY = originY + length * Math.cos(angle);

    // Draw the string connecting the origin to the pendulum bob
    ctx.beginPath();
    ctx.moveTo(originX, originY);  // Move to the origin
    ctx.lineTo(pendulumX, pendulumY);  // Draw line to the pendulum bob
    ctx.strokeStyle = '#000';  // Set the line color to black
    ctx.lineWidth = 2;  // Set the line width to 2px
    ctx.stroke();  // Render the line

    // Draw the bob (pendulum ball) as a red circle
    ctx.beginPath();
    ctx.arc(pendulumX, pendulumY, radius, 0, 2 * Math.PI);  // Draw circle at pendulum's current position
    ctx.fillStyle = '#FF0000';  // Set the fill color to red
    ctx.fill();  // Fill the circle with the color
  };

  // Handle mouse down event
  const handleMouseDown = (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // Check if the mouse click is inside the pendulum bob
    const isInsideCircle = Math.sqrt(
      (mouseX - pendulumX) ** 2 + (mouseY - pendulumY) ** 2
    ) < radius;

    if (isInsideCircle) {
      console.log("Clicked in the circle.");
    }
  };

  // Start the animation when the component is mounted
  useEffect(() => {
    animate();  // Start the animation loop

    // Add event listener for mouse down
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', handleMouseDown);

    // Cleanup event listeners when component unmounts
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Pendulum Simulator</h1>
        {/* Canvas element where the pendulum is drawn */}
        <canvas
          ref={canvasRef}  // Attach canvasRef to this canvas
          width={800}       // Set canvas width to 800px
          height={600}      // Set canvas height to 600px
        />
      </header>
    </div>
  );
}

export default App;