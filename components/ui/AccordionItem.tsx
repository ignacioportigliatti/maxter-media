import React, { useState } from "react";

const AccordionItem = ({ title, children }: {title:string, children: React.ReactNode}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-item">
      <div className={`accordion-title ${isOpen ? "open" : ""}`} onClick={toggleAccordion}>
        {title}
      </div>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export default AccordionItem;
