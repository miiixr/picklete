
module.exports.mail = {
  # type: 'ses'
  # config: {
  #   from: '',
  #   transporter: {
  #     accessKeyId: '',
  #     secretAccessKey: '',
  #   }
  # }
  templete: {
    orderConfirm: {
      sendBy: 'email',
      subject: '訂單 %(orderSerialNumber)s 成立通知信',
      html: """<html><body>
      <br />親愛的%(storeName2)s顧客您好!
      <br />
      <br />誠摯感謝您選購%(storeName3)s平台精心揀選的優質商品!
      <br />網站成立的宗旨是希望能與更多懂生活的人一同分享及找回生活中的理想樂園，
      <br />%(storeName3)s團隊在此預祝您擁有愉悅且舒適的每一天!
      <br />
      <br />以下為您於%(orderTime)s的訂購記錄，
      <br />
      <br />訂購人：%(shipmentUsername)s
      <br />訂購帳號：%(shipmentId)s
      <br />訂單編號：%(orderSerialNumber)s
      <br />付款方式：
      <br />付款方式備注：為避免取消訂單，請於%(deadLine)s前繳款完畢
      <br />
      <br />訂購項目：
      <br />%(productName)s
      <br />
      <br />為了保障您的資料安全，請登入會員中心查詢90天內所有訂單詳細資訊。
      <br />祝您購物愉快
      <br />此為系統信件，請勿直接回覆此信件
      <br />---
      <br />%(storeName)s | 好物慢慢選
      <br />客服信箱：%(serviceMail)s
      <br />上班時間：週一至週五，10.00AM - 5.00PM，比照國定休假日
      </body></html>"""
    },
    paymentConfirm: {
      sendBy: 'email',
      subject: '訂單 %(orderSerialNumber)s 已確認付款完成',
      text: """
      親愛的%(storeName2)s顧客您好!

      您於%(storeName3)s平台消費%(paymentTotalAmount)s元，已使用(信用卡/ATM/超商繳款)完成付款。

      訂單編號：%(orderSerialNumber)s ，我們將於確認定單後盡快為您出貨，謝謝您的惠顧。

      為了保障您的資料安全，請登入會員中心查詢90天內所有訂單詳細資訊。

      此為系統信件，請勿直接回覆此信件

      ---

      %(storeName)s | 好物慢慢選

      客服信箱：%(serviceMail)s

      上班時間：週一至週五，10.00AM - 5.00PM，比照國定休假日

      """
    },
    deliveryConfirm: {
      sendBy: 'email',
      subject: '訂單 %(orderSerialNumber)s 已完成出貨',
      text: """
      親愛的%(storeName2)s顧客您好!

      您的 %(storeName2)s 訂單今日已為您出貨，訂單編號：%(orderSerialNumber)s ，約2~3個工作天(不含例假日及國定假日)內抵達，煩請留意收件。

      為了保障您的資料安全，請登入會員中心查詢90天內所有訂單詳細資訊。

      此為系統信件，請勿直接回覆此信件

      ---

      %(storeName)s | 好物慢慢選

      客服信箱：%(serviceMail)s

      上班時間：週一至週五，10.00AM - 5.00PM，比照國定休假日
      """
    },
    orderSync: {
      sendBy: 'email',
      subject: '使用者 email %(email)s 訂單查詢要求連結',
      html: """
      <br />Hi %(fullName)s:

      <br />請點選下列連結取得訂單資訊

      <br /><a href='%(syncLink)s'>取得訂單資訊</a>


      <br />From %(storeName)s
      """
    },
    greeting: {
      sendBy: 'email',
      subject: '歡迎 %(fullName)s 加入ＯＯＯ會員',
      html: """<html><body>
      <br /><p>歡迎 %(fullName)s 註冊 %(storeName)s ！</p>
      <br />
      <br />誠摯感謝您註冊%(storeName3)s平台精心揀選的優質商品!
      <br />網站成立的宗旨是希望能與更多懂生活的人一同分享及找回生活中的理想樂園，
      <br />%(storeName3)s意團隊在此預祝您擁有愉悅且舒適的每一天!
      <br />
      <br />1.當您忘記帳號密碼時，請直接於會員登入頁面點選忘記密碼，系統將立即為您服務。
      <br />2.如有任何購買及會員問題請於網頁最下方的【 聯絡我們 】留言詢問。
      <br />3.請於購物前詳閱站內FAQ購物流程說明及使用條款、隱私權政策、免責聲明，感謝您的配合!
      <br />
      <br />此為系統信件，請勿直接回覆此信件
      <br />
      <br />---
      <br />
      <br />%(storeName)s | 好物慢慢選
      <br />
      <br />客服信箱：%(serviceMail)s
      <br />
      <br />上班時間：週一至週五，10.00AM - 5.00PM，比照國定休假日
      </body></html>"""
    },
    checkForgot:{
      sendBy: 'email',
      subject: '%(storeName)s - 忘記密碼通知信',
      html: """<html><body>
      <br />親愛的 %(fullName)s 您好：
      <br />
      <br />是您在我們的系統中忘記密碼了嗎??
      <br />若是您忘記了密碼，點選以下連結會幫您重置密碼，並寄到您的信箱
      <br /><a href='%(link)s'>Click Me</a>
      <br />若不是您，您可以選擇忽略此封郵件。
      <br />
      <br />此為系統信件，請勿直接回覆此信件
      <br />
      <br />---
      <br />
      <br />%(storeName)s | 好物慢慢選
      <br />
      <br />客服信箱：%(serviceMail)s
      <br />
      <br />上班時間：週一至週五，10.00AM - 5.00PM，比照國定休假日
      </body></html>"""
    },
    newPassword:{
      sendBy: 'email',
      subject: '%(fullName)s - 忘記密碼回覆信',
      html: """"<html><body>
      <br />親愛的 %(fullName)s 您好：
      <br />
      <br />您在%(createdAt)s於%(storeName2)s會員中心詢問用戶密碼，請確認下方用戶密碼並妥保存，謝謝。
      <br />我們已經幫你重置好密碼
      <br />請妥善保管下列密碼並儘速更換。
      <br />會員帳號：%(userId)s
      <br />新密碼為：<p style="color:red">%(password)s</p><br><br>
      <br />
      <br />此為系統信件，請勿直接回覆此信件
      <br />
      <br />---
      <br />
      <br />%(storeName)s | 好物慢慢選
      <br />
      <br />客服信箱：%(serviceMail)s
      <br />
      <br />上班時間：週一至週五，10.00AM - 5.00PM，比照國定休假日
      </body></html>"""
    },

    shopCode: {
      sendBy: 'email',
      subject: '您的優惠碼',
      html: """
      <br />親愛的 %(fullName)s 您好：
      <br />
      <br />%(shopCodeSentContent)s
      <br />
      <br />下面是這期的優惠碼：
      <br />%(shopCodeToken)s
      <br />可在 %(startDate)s 開始使用
      <br />並且在 %(endDate)s 前使用完畢
      <br />
      <br />此為系統信件，請勿直接回覆此信件
      <br />
      <br />---
      <br />
      <br />%(storeName)s | 好物慢慢選
      <br />
      <br />客服信箱：%(serviceMail)s
      <br />
      <br />上班時間：週一至週五，10.00AM - 5.00PM，比照國定休假日
      </body></html>"""
    },

    verification:{
      sendBy: 'email',
      subject: '%(fullName)s - 註冊驗證信',
      html: """<html><body>
      <br />親愛的 %(fullName)s 您好：
      <br />
      <br />誠摯感謝您註冊%(storeName3)s平台精心揀選的優質商品!
      <br />網站成立的宗旨是希望能與更多懂生活的人一同分享及找回生活中的理想樂園，
      <br />%(storeName3)s團隊在此預祝您擁有愉悅且舒適的每一天!
      <br />
      <br />感謝您註冊我們的服務，請點選以下連結開通帳號
      <br /><a href='%(link)s'>Click Me</a>
      <br />若不是您，您可以選擇忽略此封郵件。<br>
      <br />
      <br />1.當您忘記帳號密碼時，請直接於會員登入頁面點選忘記密碼，系統將立即為您服務。
      <br />2.如有任何購買及會員問題請於網頁最下方的【 聯絡我們 】留言詢問。
      <br />3.請於購物前詳閱站內FAQ購物流程說明及使用條款、隱私權政策、免責聲明，感謝您的配合!
      <br />
      <br />此為系統信件，請勿直接回覆此信件
      <br />
      <br />---
      <br />
      <br />%(storeName)s | 好物慢慢選
      <br />
      <br />客服信箱：%(serviceMail)s
      <br />
      <br />上班時間：週一至週五，10.00AM - 5.00PM，比照國定休假日
      </body></html>"""
    },

    userUpdate:{
      sendBy: 'email',
      subject: '%(fullName)s - 會員資料修改通知信',
      html: """<html><body>
      <br />親愛的 %(fullName)s 您好：
      <br />
      <br />您在 %(createdAt)s 於 %(storeName2)s 會員中心修改會員資料。
      <br />如您最近沒有修改任何會員資料，請聯絡我們並更換密碼。
      <br />
      <br />會員帳號：%(userId)s
      <br />
      <br />此為系統信件，請勿直接回覆此信件
      <br />
      <br />---
      <br />
      <br />%(storeName)s | 好物慢慢選
      <br />
      <br />客服信箱：%(serviceMail)s
      <br />
      <br />上班時間：週一至週五，10.00AM - 5.00PM，比照國定休假日
      </body></html>"""
    }
  }
}
