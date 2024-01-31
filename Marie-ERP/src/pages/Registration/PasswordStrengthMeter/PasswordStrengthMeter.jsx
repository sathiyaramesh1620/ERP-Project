import React from 'react'
import zxcvbn from 'zxcvbn';

const PasswordStrengthMeter = ({ passwordData }) => {
    const result = zxcvbn(passwordData);

    const strengthPercentage = result.score * 100 / 4;
    console.log(strengthPercentage);

    const createPassLabel = () => {
        switch (result.score) {
            case 0:
                return 'Very weak';
            case 1:
                return 'Weak';
            case 2:
                return 'Okay';
            case 3:
                return 'Good';
            case 4:
                return 'Strong';
            default:
                return '';
        }
    }

    const funcProgressColor = () => {
        switch (result.score) {
            case 0:
                return '#828282';
            case 1:
                return '#EA1111';
            case 2:
                return '#FFAD00';
            case 3:
                return '#9bc158';
            case 4:
                return '#00b500';
            default:
                return 'none';
        }
    }
    const changePasswordColor = () => ({
        width: `${strengthPercentage}%`,
        background: funcProgressColor(),
        height: '7px'
    })

    return (
        <>
            <div className="progress mt-1 " style={{ height: '7px' }}>
                <div className="progress-bar" style={changePasswordColor()}></div>
            </div>
            <p className=" text-end" style={{ color: funcProgressColor() }}> {createPassLabel()}</p>

        </>
    )
}

export default PasswordStrengthMeter;