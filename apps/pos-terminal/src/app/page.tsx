export default function HomePage() {
  return (
    <div className="h-screen flex">
      {/* Left side - Product grid */}
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="bg-card text-card-foreground rounded-lg border p-4 cursor-pointer hover:bg-accent"
            >
              <div className="w-full h-24 bg-muted rounded mb-2"></div>
              <h3 className="font-semibold">Product {item}</h3>
              <p className="text-sm text-muted-foreground">$19.99</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right side - Cart */}
      <div className="w-96 border-l bg-card p-4">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center p-2 border rounded">
            <span>Product 1 x2</span>
            <span>$39.98</span>
          </div>
          <div className="flex justify-between items-center p-2 border rounded">
            <span>Product 3 x1</span>
            <span>$19.99</span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total:</span>
            <span>$59.97</span>
          </div>
          <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold">
            Process Payment
          </button>
        </div>
      </div>
    </div>
  );
} 