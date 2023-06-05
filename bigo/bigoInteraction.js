const { sleep } = require('../helper/sleep')

const moveCursor = async function (page, selector) {
  const elm = await page.$(selector)
  const coordinate = await elm.boundingBox()
  console.log(coordinate)

  await page.mouse.move(
    coordinate.x + coordinate.width / 2,
    coordinate.y + coordinate.height / 2,
    {
      steps: 100 + Math.abs(coordinate.width - coordinate.height)
    })
}

const comment = async function (page) {
  await page.addScriptTag({
    content: `
        const comment = function() {
          const commentArea = document.querySelector('.user_words_msg textarea')
          const commentArr = ['Hello', 'Hi em', 'Cute', 'Xinh', 'Xin chao', 'Cưng xỉu', 'Chào em nha', 'Dễ thương vậy ta', 'Em nhà ở đâu thế', 'Em hôm nay nhìn xinh thía', 'Buổi tối vv nha em', 'Nay nhìn lạ vậy em', 'Sao hôm qua ko thấy em live', '<3 <3 <3', ':))))', ':((', ':vvv', ':3 :3', ':D :D :D', ':D :D']
          commentArea.value =
            commentArr[Math.floor(Math.random() * commentArr.length)]
          commentArea.dispatchEvent(new Event('input', { bubbles: true }))
          const sendBtn = document.querySelector('.user_words_msg .send_btn')
          sendBtn.click()
        }
      `
  })

  await moveCursor(page)

  await page.evaluate(() => comment())
  console.log('comment roi')
}

const clickToSigninBtn = async function (page) {
  await page.evaluate((_) => document.querySelector('.btn-sumbit').click())
}

const checkIfVerifySuccessfully = async function (page, isBefore) {
  let captchaTextElm = null

  if (isBefore) {
    captchaTextElm = await page.$(
      '#captcha-box-login-bigo-captcha-element-bigo-captcha-successeletext'
    )
    if (captchaTextElm === null) {
      captchaTextElm = await page.$('#captcha-box-login-bigo-captcha-element-bigo-captcha-textelediv')
    }
  } else {
    captchaTextElm = await page.$('#captcha-box-login-bigo-captcha-element-bigo-captcha-textelediv')
  }

  const captchaTextContent = await page.evaluate(
    (el) => el.textContent,
    captchaTextElm
  )

  if (!captchaTextContent.includes('successful')) {
    return false
  } else {
    return true
  }
}

const dragSliderToVerify = async function (page) {
  try {
    await page.waitForSelector(
      '#captcha-box-login-bigo-captcha-element-bigo-captcha-sliderele',
      { timeout: 5000 }
    )
  } catch (ex) {
    console.log(ex)
  }
  const sliderHandle = await page.$(
    '#captcha-box-login-bigo-captcha-element-bigo-captcha-sliderele'
  )
  const handle = await sliderHandle.boundingBox()
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2
  )
  await page.mouse.down()
  await page.mouse.move(handle.x + 500, handle.y + handle.height / 2, {
    steps: 100 + new Date().getSeconds()
  })
  await page.mouse.up()
}

const closeDownloadDialog = async function (page) {
  try {
    await page.click('.download-dialog .close')
    console.log(true)
    return true
  } catch (ex) {
    return false
  }
}

const typeInfoToLogin = async function (page, phoneNumber) {
  let isAdvertisementAppreared = await closeDownloadDialog(page)
  await moveCursor(page, '.head-right__login__btn')
  await page.click('.head-right__login__btn')

  if (!isAdvertisementAppreared) {
    isAdvertisementAppreared = await closeDownloadDialog(page)
  }
  await sleep(500)
  await moveCursor(page, '.register-tips a')
  await page.click('.register-tips a')

  if (!isAdvertisementAppreared) {
    isAdvertisementAppreared = await closeDownloadDialog(page)
  }
  await sleep(500)
  await moveCursor(page, '.tab-login-sign__item')
  await page.click('.tab-login-sign__item')

  if (!isAdvertisementAppreared) {
    isAdvertisementAppreared = await closeDownloadDialog(page)
  }
  await sleep(500)
  const currentSelected = await page.$('input.current_selected')
  await moveCursor(page, '.input.current_selected')
  await currentSelected.click()

  sleep(200)
  if (!isAdvertisementAppreared) {
    isAdvertisementAppreared = await closeDownloadDialog(page)
  }
  const country = 'Vietnam'
  for (let i = 0; i < country.length; i++) {
    await currentSelected.type(country[i])
    await page.waitForTimeout(Math.random() * (100 - 50) + 50)
  }

  sleep(500)
  if (!isAdvertisementAppreared) {
    isAdvertisementAppreared = await closeDownloadDialog(page)
  }
  await sleep(500)
  await moveCursor(page, 'ul.country_list li')
  await page.click('ul.country_list li')

  sleep(500)
  if (!isAdvertisementAppreared) {
    isAdvertisementAppreared = await closeDownloadDialog(page)
  }
  await sleep(500)
  await moveCursor(page, '.phone-number-box input')
  const phoneBox = await page.$('.phone-number-box input')
  for (let i = 0; i < phoneNumber.length; i++) {
    await phoneBox.type(phoneNumber[i])
    await page.waitForTimeout(Math.random() * (100 - 50) + 50)
  }

  sleep(500)
  if (!isAdvertisementAppreared) {
    isAdvertisementAppreared = await closeDownloadDialog(page)
  }
  await sleep(500)
  await moveCursor(page, '.password-tab input')
  const passwordBox = await page.$('.password-tab input')
  const password = '11011010aA'
  for (let i = 0; i < password.length; i++) {
    await passwordBox.type(password[i])
    await page.waitForTimeout(Math.random() * (100 - 50) + 50)
  }
}

const gotoBigoUrl = async function (page, bigoUrl) {
  await page.goto(bigoUrl, { timeout: 500000 })
}

const interactWithBigo = async function (page, bigoUrl, phoneNumber) {
  await gotoBigoUrl(page, bigoUrl)

  sleep(5000)

  await typeInfoToLogin(page, phoneNumber)

  sleep(200)

  let didVerifySuccessfully = await checkIfVerifySuccessfully(page, true)
  if (!didVerifySuccessfully) {
    await dragSliderToVerify(page)

    await sleep(500)

    didVerifySuccessfully = await checkIfVerifySuccessfully(page, false)

    if (didVerifySuccessfully) {
      console.log(`LOGIN WITH ${phoneNumber} SUCCESSFULLY`)
    } else {
      console.log(`Login with ${phoneNumber} failed`)
      await page.close()
      return
    }
  } else {
    console.log(`LOGIN WITH ${phoneNumber} SUCCESSFULLY`)
  }

  sleep(1000)
  await moveCursor(page, '.btn-sumbit')
  await page.click('.btn-sumbit')

  await sleep(2000)

  const commentArr = ['Hello', 'Hi em', 'Cute', 'Xinh', 'Xin chao', 'Cưng xỉu', 'Chào em nha', 'Dễ thương vậy ta', 'Em nhà ở đâu thế', 'Em hôm nay nhìn xinh thía', 'Buổi tối vv nha em', 'Nay nhìn lạ vậy em', 'Sao hôm qua ko thấy em live', '<3 <3 <3', ':))))', ':((', ':vvv', ':3 :3', ':D :D :D', ':D :D']
  const randomComment = commentArr[Math.floor(Math.random() * commentArr.length)]
  const commentBox = await page.$('.user_words_msg textarea')
  await moveCursor(page, '.user_words_msg textarea')
  for (let i = 0; i < randomComment.length; i++) {
    await commentBox.type(randomComment[i])
  }
  await moveCursor(page, '.user_words_msg .send_btn')
  await page.click('.user_words_msg .send_btn')
}

const interactWithBigo1 = async function (page, bigoUrl, phoneNumber) {
  let isAdvertisementAppreared = false

  await gotoBigoUrl(page, bigoUrl)

  await moveCursor(page)

  await page.addScriptTag({
    content: `
        const typeInfoToLogin = function() {
          const listLi = Array.from(
            document.querySelectorAll('.country_list li')
          )
          listLi[listLi.length - 6].click()
          const phoneInput = document.querySelector('.phone-number-box input')
          phoneInput.setAttribute('value', ${phoneNumber})
          phoneInput.dispatchEvent(new Event('input', { bubbles: true }))
          const passwordInput = document.querySelector('.password-tab input')
          passwordInput.setAttribute('value', '11011010aA')
          passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
        }
      `
  })

  try {
    // maybe advertisement would appear first
    await typeInfoToLogin(page, isAdvertisementAppreared)
  } catch (ex) {
    // handle the case that advertisement appear first
    isAdvertisementAppreared = true

    await closeDownloadDialog(page)

    await moveCursor(page)

    await typeInfoToLogin(page, isAdvertisementAppreared)

    await moveCursor(page)
  }

  if (!isAdvertisementAppreared) {
    await moveCursor(page)

    await closeDownloadDialog(page)
  }

  await moveCursor(page)

  let didVerifySuccessfully = await checkIfVerifySuccessfully(page, true)
  if (!didVerifySuccessfully) {
    await dragSliderToVerify(page)

    await moveCursor(page)

    didVerifySuccessfully = await checkIfVerifySuccessfully(page, false)

    if (didVerifySuccessfully) {
      console.log(`LOGIN WITH ${phoneNumber} SUCCESSFULLY`)
    } else {
      console.log(`Login with ${phoneNumber} failed`)
      await page.close()
      return
    }
  } else {
    console.log(`LOGIN WITH ${phoneNumber} SUCCESSFULLY`)
  }

  await moveCursor(page)

  await clickToSigninBtn(page)

  await moveCursor(page)

  comment(page)
}

module.exports = { interactWithBigo }
