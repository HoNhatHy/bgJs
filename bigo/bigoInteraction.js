const { sleep } = require('../helper/sleep')

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

  const randomNumber = Math.random() * (100000 - 1000) + 1000
  await sleep(randomNumber)

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
  await page.evaluate((_) => {
    const downloadDialogCloseBtn = document.querySelector(
      '.download-dialog .close'
    )
    if (downloadDialogCloseBtn) downloadDialogCloseBtn.click()
  })
}

const typeInfoToLogin = async function (page, isAdvertisementAppreared) {
  if (!isAdvertisementAppreared) {
    await page.evaluate((_) => {
      document.querySelector('.head-right__login__btn').click()
    })

    await sleep(500)

    await page.evaluate((_) => {
      document.querySelector('.right-top-change').click()
    })

    await sleep(500)

    await page.evaluate(() => typeInfoToLogin())
  } else {
    await page.evaluate(() => typeInfoToLogin())
  }
}

const gotoBigoUrl = async function (page, bigoUrl) {
  await page.goto(bigoUrl, { timeout: 500000 })
}

const interactWithBigo = async function (page, bigoUrl, phoneNumber) {
  let isAdvertisementAppreared = false

  await gotoBigoUrl(page, bigoUrl)

  await sleep(2000)

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

    await sleep(500)

    await typeInfoToLogin(page, isAdvertisementAppreared)

    await sleep(5000)
  }

  if (!isAdvertisementAppreared) {
    await sleep(10000)

    await closeDownloadDialog(page)
  }

  await sleep(500)

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

  await clickToSigninBtn(page)

  await sleep(5000)

  comment(page)
}

module.exports = { interactWithBigo }
