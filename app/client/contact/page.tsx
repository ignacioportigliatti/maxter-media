import ContactForm from "@/components/client/contact/ContactForm";
import { Agency, Group } from "@prisma/client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

interface ContactPageProps {}

const ContactPage = (props: ContactPageProps) => {
  return (
    <div className="w-full flex flex-col max-w-[100vw] items-center justify-center px-6 gap-6 py-8 md:py-14 md:px-14">
      <ContactForm />
    </div>
  );
};

export default ContactPage;
