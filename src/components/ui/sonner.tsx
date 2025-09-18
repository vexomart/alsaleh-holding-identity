import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-md group-[.toaster]:bg-opacity-95 group-[.toaster]:min-w-[400px] group-[.toaster]:mx-auto",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        style: {
          transform: 'translateX(-50%)',
          left: '50%',
          margin: '0 auto',
          textAlign: 'center',
          borderRadius: '12px',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '500',
        }
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
