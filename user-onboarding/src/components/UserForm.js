import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

// props from Formik => values, errors, touched, status
// these are prefixed props sent from Formik into AnimalForm because AnimalForm is wrapped by withFormik HOC
// values => state of inputs & updates with change in input
// errors => any errors from Yup validation
// touched => when an input has be entered and moved away from by user
// status => when chagne from API has updated via setStatus
const SignUpForm = ({ values, errors, touched, status }) => {
  // console.log("values", values);
  // console.log("errors", errors);
  // console.log("touched", touched);

  // local state that holds successful form submission data
  const [users, setUsers] = useState([]);

  // listens for status changes to update animals state
  useEffect(() => {
    console.log("status has changed!", status);
    // if status has content (an obj from API response) then render function setAnimals
    // use a spread to create a new array with all of animals' previous values + the new obj from the API stored in status
    // could be setAnimals([...animals, status]) but that fires a warning that we should watch animals. We don't need to watch for animals changes (this is the only place it could change)
    // change to animals => [...animals, status] to read in the current value of animals, and then use it to create a new array
    status && setUsers(users => [...users, status]);
  }, [status]);
  return (
    <div>  
    {/* Form automagically applies handleSubmit from withFormik options declared below*/}
      <Form>
        {/* can wrap Field with label to apply label. Need id on Field to create association*/}
        <label htmlFor="name">
          Name
          {/* name is the key within values (the current state of the form inputs) */}
          <Field
            id="name"
            type="text"
            name="name"
            placeholder="Your Name"
          />
          {/* touched is if input has been visited, errors are captured from Yup validation. 
          If has been visited && errors exist for that input => render JSX to show errors*/}
          {touched.name && errors.name && (
            <p className="errors">{errors.name}</p>
          )}
        </label>
        <label htmlFor="email">
          Email
          <Field 
            id="size" 
            type="text" 
            name="size" 
            placeholder="size" />
          {touched.email && errors.email && (
            <p className="errors">{errors.email}</p>
          )}
        </label>
        {/* For Fields that use input elements other thank <input /> use as to declare what HTML input to use for Field*/}
        <label htmlFor="password">
          Email
          <Field 
            id="password" 
            type="password" 
            name="password" 
            placeholder="password " />
          {touched.password && errors.password && (
            <p className="errors">{errors.passwprd}</p>
          )}
        </label>


        <label className="checkbox-container">
          Read Terms of Service
          <Field
            type="checkbox"
            name="vaccinations"
            checked={values.vaccinations}
          />
          <span className="checkmark" />
        </label>
        <Field as="textarea" type="text" name="notes" placeholder="Notes" />
        <button type="submit">Submit!</button>
      </Form>
      {users.map(animal => {
        return (
          <ul key={animal.id}>
            <li>Species: {animal.species}</li>
            <li>Size: {animal.size}</li>
          </ul>
        );
      })}
    </div>
  );
};

const FormikSignUpForm = withFormik({
  // props from <AnimalForm /> in app are in props param
  mapPropsToValues(props) {
    // set initial state of form to value from parent component OR the initial value (after || )
    return {
      species: props.species || "",
      size: props.size || "",
      diet: props.diet || "",
      vaccinations: props.vaccinations || false,
      notes: props.notes || ""
    };
  },

  // Declare shape and requirement of values object (form state )
  validationSchema: Yup.object().shape({
    user: Yup.string().required(),
    // passing a string in required makes a custom inline error msg
    size: Yup.string().required("SIZE IS MANDATORY")
  }),

  // passed through props (magically) to Form component in Formik
  // fires when button type=submit is fired
  // values = state of form, formikBag is second param
  // in FormikBag: setStatus (sends API response to AnimalForm) & resetForm (clears form when called)
  handleSubmit(values, { setStatus, resetForm }) {
    console.log("submitting", values);
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        console.log("success", res);
        // sends a status update through props in AnimalForm with value as res.data content
        setStatus(res.data);

        //clears form inputs, from FormikBag
        resetForm();
      })
      .catch(err => console.log(err.response));
  }
})(SignUpForm);
export default FormikSignUpForm;