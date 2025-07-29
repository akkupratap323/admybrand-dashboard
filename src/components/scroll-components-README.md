# Scroll-Triggered Expansion Components

A comprehensive set of scroll-triggered animation components for the ADmyBRAND Insights analytics dashboard, featuring smooth animations and progressive content loading.

## Components Overview

### 1. `ScrollExpansion`
Basic scroll-triggered animation component with multiple direction options.

```tsx
import { ScrollExpansion } from "@/components/scroll-expansion"

<ScrollExpansion
  direction="up"     // "up" | "down" | "left" | "right" | "scale" | "fade"
  delay={200}        // Delay in milliseconds
  duration={0.6}     // Animation duration
  threshold={0.1}    // Intersection observer threshold
  triggerOnce={true} // Whether to trigger animation only once
  stagger={false}    // Enable staggered animation for children
  staggerDelay={0.1} // Delay between staggered children
>
  <YourContent />
</ScrollExpansion>
```

### 2. `ProgressiveExpansion`
Progressive content loading with multiple stages.

```tsx
import { ProgressiveExpansion } from "@/components/scroll-expansion"

<ProgressiveExpansion
  stageDelay={300}
  direction="up"
  stages={[
    {
      content: <FirstStage />,
      delay: 0,
      className: "mb-4"
    },
    {
      content: <SecondStage />,
      delay: 200,
      className: "mb-4"
    },
    {
      content: <ThirdStage />,
      delay: 400
    }
  ]}
/>
```

### 3. `ScrollReveal`
Content reveal component with scroll progress.

```tsx
import { ScrollReveal } from "@/components/scroll-expansion"

<ScrollReveal
  revealHeight={200}    // Initial reveal height in pixels
  showProgress={true}   // Show progress bar
  className="custom-class"
>
  <YourLongContent />
</ScrollReveal>
```

### 4. `ExpandableCard`
Card component that expands content based on scroll position.

```tsx
import { ExpandableCard } from "@/components/scroll-expansion"

<ExpandableCard
  title="Card Title"
  icon={<IconComponent />}
  expandOnScroll={true}
  preview={<PreviewContent />}
  expandedContent={<DetailedContent />}
/>
```

### 5. `AnimatedCounter`
Number counter that animates when scrolled into view.

```tsx
import { AnimatedCounter } from "@/components/animated-counter"

<AnimatedCounter
  from={0}
  to={12847}
  duration={2000}
  prefix="$"
  suffix="K"
  separator=","
  decimals={1}
  className="text-2xl font-bold"
/>
```

### 6. `ScrollProgressBar`
Progress bar that fills based on page scroll progress.

```tsx
import { ScrollProgressBar } from "@/components/animated-counter"

<ScrollProgressBar
  height="h-2"
  backgroundColor="bg-muted"
  fillColor="bg-primary"
  showPercentage={true}
/>
```

### 7. `TypewriterText`
Text that types out character by character when in view.

```tsx
import { TypewriterText } from "@/components/animated-counter"

<TypewriterText
  text="Welcome to ADmyBRAND Insights"
  speed={100}
  delay={500}
  cursor={true}
  className="text-xl font-semibold"
/>
```

### 8. `FloatingElement`
Elements that float based on scroll position (parallax effect).

```tsx
import { FloatingElement } from "@/components/animated-counter"

<FloatingElement
  speed={0.5}
  direction="up"
  className="absolute top-10 right-10"
>
  <YourFloatingContent />
</FloatingElement>
```

## Custom Hooks

### `useScrollAnimation`
Basic scroll detection hook with intersection observer.

```tsx
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation"

const { elementRef, isVisible } = useScrollAnimation({
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
  triggerOnce: true,
  delay: 0
})
```

### `useProgressiveLoading`
Progressive content loading with stages.

```tsx
import { useProgressiveLoading } from "@/lib/hooks/use-scroll-animation"

const { elementRef, currentStage, isVisible } = useProgressiveLoading(3, 200)
```

### `useScrollProgress`
Track scroll progress within an element.

```tsx
import { useScrollProgress } from "@/lib/hooks/use-scroll-animation"

const { elementRef, scrollProgress } = useScrollProgress()
```

## Implementation Examples

### Basic Analytics Card Animation
```tsx
<ScrollExpansion direction="scale" delay={100}>
  <Card className="analytics-card">
    <CardContent>
      <AnimatedCounter to={284500} prefix="$" />
      <TypewriterText text="Total Revenue" />
    </CardContent>
  </Card>
</ScrollExpansion>
```

### Progressive Dashboard Loading
```tsx
<ProgressiveExpansion
  stages={[
    { content: <MetricsSection /> },
    { content: <ChartsSection /> },
    { content: <DataTableSection /> }
  ]}
  stageDelay={400}
/>
```

### Expandable Analytics Report
```tsx
<ExpandableCard
  title="Performance Report"
  icon={<BarChart3 />}
  preview={<SummaryMetrics />}
  expandedContent={<DetailedAnalytics />}
  expandOnScroll={true}
/>
```

## Performance Considerations

1. **Intersection Observer**: All components use efficient intersection observer APIs
2. **Trigger Once**: Most animations trigger only once by default to improve performance
3. **Passive Scroll Listeners**: All scroll listeners use passive event handling
4. **Cleanup**: Proper cleanup of observers and timers on component unmount
5. **Throttling**: Built-in throttling for scroll-based animations

## Customization

### Animation Variants
All components support custom animation variants through Framer Motion:

```tsx
const customVariants = {
  hidden: { opacity: 0, rotateX: -90 },
  visible: { opacity: 1, rotateX: 0 }
}
```

### Easing Functions
Custom easing functions can be applied:

```tsx
const customEasing = [0.25, 0.1, 0.25, 1.0] // Custom cubic-bezier
```

### Responsive Behavior
Components automatically adapt to different screen sizes and can be configured with responsive breakpoints.

## Browser Support

- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 15+

All modern browsers with IntersectionObserver API support.

## Best Practices

1. Use `triggerOnce={true}` for performance-critical sections
2. Implement appropriate `threshold` values based on content
3. Add `loading` states for better UX
4. Test animations on various devices and screen sizes
5. Consider reduced motion preferences for accessibility
6. Use semantic HTML structure for better screen reader support

## Demo

Visit the "Scroll Demo" tab in the dashboard to see all components in action with real analytics data and interactive examples.