import "../style/TaskBar.css"
import Button from './Button.js'

function TaskBar({ left = "TISSO VISON", center = "Find the ideal gift for your love ones", onAction, 
    baseBg = "#fff544",
    hoverBg = "#000",
    baseColor = "#000",
    hoverColor = "#fff" }) {
    return (
        <div className="taskbar">
            <div className="tb-left">{left}</div>
            <div className="tb-center">{center}</div>
            <div className="tb-right">
                <Button
                    label="CHOOSE GIFT"
                    onClick={onAction}
                    baseBg={baseBg}
                    hoverBg={hoverBg}
                    baseColor={baseColor}
                    hoverColor={hoverColor}
                />
            </div>
        </div>
    );
}

export default TaskBar;