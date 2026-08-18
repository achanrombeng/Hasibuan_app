# Engineering Guidelines & Documentation

## 1. Core Principles & Code Style

### SOLID Principles

- **SRP**: A class/component should have one reason to change.
- **OCP**: Open for extension, closed for modification.
- **LSP**: Subtypes must be substitutable for base types.
- **ISP**: Depend on small interfaces, not fat ones.
- **DIP**: Depend on abstractions.

### Clean Code Style

- **Naming**: Be descriptive.

    ```php
    // Bad
    $d = 0; // elapsed days

    // Good
    $elapsedDaysInYear = 0;
    ```

- **Functions**: Small and focused.

    ```tsx
    // Bad: Doing too much
    function UserProfile() {
        // fetching logic...
        // validation logic...
        // complex render logic...
    }

    // Good: Composition
    function UserProfile({ user }) {
        return (
            <Card>
                <Avatar url={user.avatar} />
                <UserInfo params={user} />
            </Card>
        );
    }
    ```

## 2. Architecture & Design Patterns

### Frontend: React + Tailwind

- **Component Structures**:

    ```tsx
    // resources/js/components/ui/Button.tsx
    // Abstract common styles into reusable components
    import { cn } from '@/lib/utils';

    export function Button({ className, variant, ...props }) {
        return (
            <button
                className={cn(
                    'rounded-md px-4 py-2 font-medium transition-colors',
                    variant === 'primary' &&
                        'bg-terra-900 hover:bg-wood text-white',
                    variant === 'ghost' && 'hover:bg-sand-100 bg-transparent',
                    className,
                )}
                {...props}
            />
        );
    }
    ```

- **Usage in Pages**:

    ```tsx
    // Do NOT repeat long utility strings repeatedly. Use the component.
    // Bad
    <button className="px-4 py-2 rounded-md font-medium bg-terra-900 text-white hover:bg-wood">
        Save
    </button>

    // Good
    <Button variant="primary">Save</Button>
    ```

### Backend: Laravel

- **Thin Controllers**: Delegate logic to Services or Models.

    ```php
    // Bad: Logic in Controller
    public function store(Request $request) {
        $request->validate([...]);
        $order = new Order;
        $order->total = $request->items->sum('price');
        $order->save();
        // sending email...
        return response()->json($order);
    }

    // Good: Service + FormRequest
    public function store(StoreOrderRequest $request, OrderService $service) {
        $order = $service->createOrder($request->validated());
        return response()->json($order);
    }
    ```

## 3. Libraries & Dependencies (Don't Re-invent)

**Principle**: Do not build custom solutions for problems already solved by the framework or standard libraries.

- **Check existing libraries first**: Before coding a complex utility, check the Laravel/React ecosystem.
- **Date Handling**:

    ```tsx
    // Bad: Custom Date formatting
    function formatDate(date) {
        const d = new Date(date);
        return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(); // Implementation errors likely
    }

    // Good: Use "date-fns" or standard Intl API
    import { format } from 'date-fns';
    format(new Date(date), 'dd/MM/yyyy');
    ```

- **Arrays/Collections**:

    ```php
    // Bad: Manual loops
    $activeUsers = [];
    foreach ($users as $user) {
        if ($user->isActive) {
            $activeUsers[] = $user;
        }
    }

    // Good: Laravel Collections
    $activeUsers = $users->filter(fn($u) => $u->isActive);
    ```

## 4. System Design

- **Monolithic MVC**: Laravel handles routing/data. React handles View.
- **Strict Typing**: All TypeScript files must define interfaces.
    ```tsx
    interface UserProps {
        id: number;
        name: string;
        email: string;
        roles: string[];
    }
    ```
