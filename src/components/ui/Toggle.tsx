import { ToggleSwitch } from './ToggleSwitch';

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}

export const Toggle = ({ enabled, onChange, size = 'md', disabled = false }: ToggleProps) => {
    return (
        <ToggleSwitch
            isOn={enabled}
            onToggle={() => onChange(!enabled)}
            disabled={disabled}
        />
    );
};
