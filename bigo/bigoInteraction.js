const { sleep } = require('../helper/sleep')

const moveCursor = async function (page, selector) {
  try {
    const elm = await page.$(selector)
    const coordinate = await elm.boundingBox()

    await page.mouse.move(
      coordinate.x + coordinate.width / 2,
      coordinate.y + coordinate.height / 2,
      {
        steps: Math.random() * (200 - 100) + 100
      })
  } catch (ex) {
    console.log(ex)
  }
}

const comment = async function (page) {
  const commentArr = ['Hello', 'Hi em', 'Cute', 'Xinh', 'Xin chao', 'Cưng xỉu', 'Chào em nha', 'Dễ thương vậy ta', 'Em nhà ở đâu thế', 'Em hôm nay nhìn xinh thía', 'Buổi tối vv nha em', 'Nay nhìn lạ vậy em', 'Sao hôm qua ko thấy em live', '<3 <3 <3', ':))))', ':((', ':vvv', ':3 :3', ':D :D :D', ':D :D']
  const randomComment = commentArr[Math.floor(Math.random() * commentArr.length)]
  const commentBox = await page.$('.user_words_msg textarea')
  for (let i = 0; i < randomComment.length; i++) {
    await commentBox.type(randomComment[i])
  }
  await page.evaluate((_) => {
    document.querySelector('.user_words_msg .send_btn').click()
  })
  console.log('commented')
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
    handle.y + handle.height / 2,
    {
      steps: 100 + new Date().getSeconds()
    }
  )
  await page.mouse.down()
  await page.mouse.move(handle.x + 500, handle.y + handle.height / 2, {
    steps: 100 + new Date().getSeconds()
  })
  await page.mouse.up()
}

const closeDownloadDialog = async function (page) {
  await moveCursor(page, '.download-dialog .close')
  await page.evaluate((_) => {
    document.querySelector('.download-dialog .close').click()
  })
}

const typeInfoToLogin = async function (page, phoneNumber) {
  await moveCursor(page, '.head-right__login__btn')
  await page.evaluate((_) => {
    document.querySelector('.head-right__login__btn').click()
  })

  await moveCursor(page, '.register-tips a')
  await page.evaluate((_) => {
    document.querySelector('.register-tips a').click()
  })

  await moveCursor(page, '.tab-login-sign__item')
  await page.evaluate((_) => {
    document.querySelector('.tab-login-sign__item').click()
  })

  const currentSelected = await page.$('input.current_selected')
  await moveCursor(page, 'input.current_selected')
  await page.evaluate((_) => {
    document.querySelector('input.current_selected').click()
  })

  const country = 'Vietnam'
  for (let i = 0; i < country.length; i++) {
    await currentSelected.type(country[i])
    await page.waitForTimeout(Math.random() * (100 - 50) + 50)
  }
  await moveCursor(page, 'ul.country_list li')
  await page.evaluate((_) => {
    document.querySelector('ul.country_list li').click()
  })

  await moveCursor(page, '.phone-number-box input')
  const phoneBox = await page.$('.phone-number-box input')
  for (let i = 0; i < phoneNumber.length; i++) {
    await phoneBox.type(phoneNumber[i])
    await page.waitForTimeout(Math.random() * (100 - 50) + 50)
  }

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

// Bigo interaction

const interactWithBigo = async function (page, bigoUrl, phoneNumber) {
  // 1) go to bigo
  await gotoBigoUrl(page, bigoUrl)
  await page.mouse.wheel({
    deltaY: Math.random() * (150 - 120) + 120
  })
  await sleep(30000)

  // 2) close advertisement
  await closeDownloadDialog(page)
  await sleep(200)

  // 3) type login information
  await typeInfoToLogin(page, phoneNumber)
  await sleep(200)

  // 4) drag slider
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
  await sleep(500)

  // 5) hit submit button
  await moveCursor(page, '.btn-sumbit')
  await page.evaluate((_) => {
    document.querySelector('.btn-sumbit').click()
  })

  // 6) reload page
  await page.reload()

  // 7) comment
  await sleep(5000)
  comment(page)
}

module.exports = { interactWithBigo }
