import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      toastOptions={{
        duration: 10000,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-sm group-[.toaster]:bg-opacity-95 group-[.toaster]:min-w-[450px] group-[.toaster]:max-w-[600px] group-[.toaster]:mx-auto",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:mt-1",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        style: {
          borderRadius: '16px',
          padding: '20px 24px',
          fontSize: '16px',
          fontWeight: '600',
          textAlign: 'center',
          border: '2px solid hsl(var(--border))',
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
        }
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
