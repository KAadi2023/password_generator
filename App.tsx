import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

//form Validation
import * as Yup from 'yup'

import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Formik } from 'formik'

const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'Should be at least 4 characters')
    .max(16, 'Should be max 16 characters')
    .required('Length must be requied')
})

export default function App() {

  const [password, setPassword] = useState('')
  const [isPassGenerated, setIsPassGenerated] = useState(false)

  const [lowercase, setLowercase] = useState(true)
  const [uppercase, setUppercase] = useState(false)
  const [numbers, setNumbers] = useState(false)
  const [symbols, setSymbols] = useState(false)

  const generatePasswordString = (passwordLength: number) => {
    let passwordString = ''

    if (lowercase) {
      passwordString += 'abcdefghijklmnopqrstuvwxyz'
    }
    if (uppercase) {
      passwordString += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
    if (numbers) {
      passwordString += '0123456789'
    }
    if (symbols) {
      passwordString += '!@#$%^&*()'
    }

    const passwordResult = createPassword(passwordString, passwordLength)
    setPassword(passwordResult)
    setIsPassGenerated(true)
  }

  const createPassword = (character: string, passwordLength: number) => {
    let result = ''
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.round(Math.random() * character.length)
      result += character.charAt(characterIndex)
    }
    return result
  }

  const resetPasswordState = () => {
    setPassword('')
    setLowercase(true)
    setUppercase(false)
    setNumbers(false)
    setSymbols(false)
    setIsPassGenerated(false)
  }

  return (
    <ScrollView keyboardShouldPersistTaps='handled'>
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.container} >
          <Text style={styles.headerText}>Password Generator</Text>
          <Formik
            initialValues={{ passwordLength: '' }}
            validationSchema={PasswordSchema}
            onSubmit={values => {
              console.log(values)
              generatePasswordString(+values.passwordLength) //TODO
            }}
          >
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleSubmit,
              handleReset,
              /* and other goodies */
            }) => (
              <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputColumn}>
                    <Text style={styles.inputLabel}>Password Length</Text>
                    {
                      touched.passwordLength && errors.passwordLength && (
                        <Text style={styles.errorText}>{errors.passwordLength}</Text>
                      )
                    }
                  </View>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('passwordLength')}
                    value={values.passwordLength}
                    keyboardType='numeric'
                    placeholder='Ex. 8'
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Include Lowercase</Text>
                  <BouncyCheckbox
                    isChecked={lowercase}
                    disableBuiltInState
                    onPress={() => setLowercase(!lowercase)}
                    fillColor='#15e4a9'
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Include Uppercase letters</Text>
                  <BouncyCheckbox
                    isChecked={uppercase}
                    disableBuiltInState
                    onPress={() => setUppercase(!uppercase)}
                    fillColor='#f5c310'
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Include Numbers</Text>
                  <BouncyCheckbox
                    isChecked={numbers}
                    disableBuiltInState
                    onPress={() => setNumbers(!numbers)}
                    fillColor='#aa20eb'
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Include Symbols</Text>
                  <BouncyCheckbox
                    isChecked={symbols}
                    disableBuiltInState
                    onPress={() => setSymbols(!symbols)}
                    fillColor='#ee1456'
                  />
                </View>

                <View style={styles.formAction}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                      handleReset()
                      resetPasswordState()
                    }}
                  >
                    <Text style={styles.formActionText}>Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={!isValid}
                    style={styles.primaryBtn}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.formActionText}>Generate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>

        {
          isPassGenerated && (
            <View style={[styles.card, styles.cardElevated]}>
              <Text style={styles.subTitle}>Generated Password:</Text>
              <Text style={styles.description}>Long press to copy</Text>
              <Text style={styles.generatedPassword} selectable={true}>{password}</Text>
            </View>
          )
        }
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create(
  {
    appContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#82d1f3',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F5FCFF',
      margin: 20,
      borderRadius: 10,
      padding: 10,
    },
    formContainer: {
      width: '90%',
      borderRadius: 10,
      padding: 20,
    },
    headerText: {
      fontSize: 28,
      fontWeight: '600',
      color: '#000000',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff'
    },
    inputWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    inputColumn: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    formAction: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    formActionText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#000',
      margin: 10,
    },
    inputLabel: {
      fontSize: 18,
      fontWeight: '600',
      color: '#000000',
      margin: 10,
    },
    errorText: {
      fontSize: 14,
      fontWeight: '500',
      color: 'red',
      margin: 2,
    },
    input: {
      width: 150,
      height: 40,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#000',
      padding: 10,
      fontSize: 18,
      fontWeight: '600',
      color: '#000000',
      margin: 10,
    },
    primaryBtn: {
      backgroundColor: '#3af171',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#000',
      width: 100,
      fontSize: 18,
      fontWeight: '600',
      color: '#000000',
      margin: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    secondaryBtn: {
      backgroundColor: '#f06666',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#000',
      width: 100,
      fontSize: 18,
      fontWeight: '600',
      color: '#000000',
      margin: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      padding: 12,
      borderRadius: 6,
      marginHorizontal: 12,
      width: '95%',
      marginBottom: 10,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardElevated: {
      backgroundColor: '#ffffff',
      elevation: 1,
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowColor: '#333',
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    subTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#000000',
      margin: 10,
    },
    description: {},
    generatedPassword: {
      fontSize: 30,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 12,
      color: '#000'
    },
  }
)