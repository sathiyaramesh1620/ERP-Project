import React from 'react'
import BasicInformation from './BasicInformation';
import ContactInformation from './ContactInformation';
import OperatingDays from './OperatingDays';
import OtherInformation from './OtherInformation';
import PasswordCreation from './PasswordCreation';

const   CurrentStep = ({ _step }) => {
    switch (_step) {
      case 1:
        return <BasicInformation />;
      case 2:
        return <ContactInformation />;
      case 3:
        return <OperatingDays />;
      case 4:
        return <OtherInformation />;
      case 5:
        return <PasswordCreation/>
      default:
        break;
    }
  };

export default CurrentStep;