// HTTP APIを実行しやすくするためのライブラリ: Axios
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const CHANNEL_SECRET = process.env.CHANNEL_SECRET;
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

// LINE APIのラッパー
class LineApi {
  constructor(channelSecret) {
    this.api = new axios.create({
      baseURL: "https://api.line.me/v2",
      headers: {
        Authorization: `Bearer ${channelSecret}`,
        "Content-Type": "application/json",
      },
    });
  }

  // 応答メッセージAPI
  async replyMessage(replyToken, message) {
    const body = {
      replyToken,
      messages: [
        {
          type: "text",
          text: message,
        },
      ],
    };

    return await this.api.post("/bot/message/reply", body);
  }

  // ここにさらに必要に応じてAPIを呼び出すメソッドを定義しましょう

  // プッシュメッセージAPI
  async pushMessage(to, message) {
    const body = {
      to,
      messages: [
        {
          type: "text",
          text: message,
        },
      ],
    };
    return await this.api.post("/bot/message/push", body);
  }

  //ボタンテンプレートメッセージAPI
  async startJanken(to) {
    const body = {
      to,
      messages: [
        {
          type: "template",
          altText: "じゃんけん",
          template: {
            type: "buttons",
            text: "じゃんけんしましょう",
            actions: [
              {
                type: "postback",
                label: "ぐー",
                data: "action=gu"
              },
              {
                "type": "postback",
                "label": "ちょき",
                "data": "action=choki"
              },
              {
                "type": "postback",
                "label": "ぱー",
                "data": "action=pa"
              }
            ]
          },
        },
      ],
    };
    return await this.api.post("/bot/message/push", body);
  }

  //リッチメニュー作成API
  async setRichMenu() {
    const body = {
      "size": {
        "width": 2500,
        "height": 1686
      },
      "selected": true,
      "name": "Rich Menu Example",
      "chatBarText": "メニューを開く",
      "areas": [
        {
          "bounds": {
            "x": 0,
            "y": 0,
            "width": 1250,
            "height": 843
          },
          "action": {
            "type": "postback",
            "data": "richmenu=0"
          }
        },
        {
          "bounds": {
            "x": 1250,
            "y": 0,
            "width": 1250,
            "height": 843
          },
          "action": {
            "type": "postback",
            "data": "richmenu=1"
          }
        },
        {
          "bounds": {
            "x": 0,
            "y": 843,
            "width": 1250,
            "height": 843
          },
          "action": {
            "type": "postback",
            "data": "richmenu=2"
          }
        },
        {
          "bounds": {
            "x": 1250,
            "y": 843,
            "width": 1250,
            "height": 843
          },
          "action": {
            "type": "postback",
            "data": "richmenu=3"
          }
        }
      ]
    }
    return await this.api.post("/bot/richmenu", body);
  }

  //画像をアップロードするAPI
  async uploadImage(richMenuId, image) {
    const apiUrl = `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`;
    const file = fs.readFileSync(image);
    const headers = {
      'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'image/jpeg'
    };
    return await axios.post(apiUrl, file, { headers: headers })
  }

  async setDefaultRichMenu(richMenuId) {
    return await this.api.post("/bot/user/all/richmenu/" + richMenuId);
  }

  //Flex Messageを送信するAPI
  async pushSiteFlexMessage(to) {
    const body = {
      to,
      messages: [
        {
          "type": "flex",
          "altText": "This is a Flex Message",
          "contents": {
            "type": "carousel",
            "contents": [
              {
                "type": "bubble",
                "hero": {
                  "type": "image",
                  "url": "https://store.washism.com/wp-content/uploads/2020/07/kaminokakera_a5__1.jpg",
                  "size": "full",
                  "aspectRatio": "20:13",
                  "aspectMode": "cover",
                  "action": {
                    "type": "uri",
                    "uri": "https://store.washism.com/"
                  }
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "sogoro",
                      "weight": "bold",
                      "size": "3xl",
                      "align": "start",
                      "offsetBottom": "lg"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "margin": "lg",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "baseline",
                          "spacing": "sm",
                          "contents": [
                            {
                              "type": "text",
                              "text": "越前和紙の1500年の伝統を受け継ぎ、職人の想いや技術はそのままに、新しいエッセンスを加えた楽しくかわいい和紙ギフトアイテムをご提案している、1949年創業の山岸和紙店の和紙ブランドです。",
                              "color": "#aaaaaa",
                              "size": "sm",
                              "flex": 1,
                              "wrap": true,
                              "offsetBottom": "xs"
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  "borderWidth": "none"
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "button",
                      "style": "link",
                      "height": "sm",
                      "action": {
                        "type": "uri",
                        "label": "サイトへ",
                        "uri": "https://store.washism.com/"
                      }
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [],
                      "margin": "sm"
                    }
                  ],
                  "flex": 0
                }
              },
              {
                "type": "bubble",
                "hero": {
                  "type": "image",
                  "url": "https://img07.shop-pro.jp/PA01447/828/product/150830907_o2.jpg?cmsp_timestamp=20201013113525",
                  "size": "full",
                  "aspectRatio": "20:13",
                  "aspectMode": "cover",
                  "action": {
                    "type": "uri",
                    "uri": "https://wakasa-ohashi.shop-pro.jp/"
                  }
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "大岸正商店",
                      "weight": "bold",
                      "size": "3xl",
                      "align": "start",
                      "offsetBottom": "lg"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "margin": "lg",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "baseline",
                          "spacing": "sm",
                          "contents": [
                            {
                              "type": "text",
                              "text": "国内塗箸生産シェアの約8割を誇る福井県小浜市で、1969年より3代に渡って箸屋を営んでいる大岸正商店です。400年の歴史を持つ伝統の若狭塗箸をはじめ、普段使いにぴったりな食洗機対応の箸、大切な方へ贈るギフトセットなど、各種取り揃えています。",
                              "color": "#aaaaaa",
                              "size": "sm",
                              "flex": 1,
                              "wrap": true,
                              "offsetBottom": "xs"
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  "borderWidth": "none"
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "button",
                      "style": "link",
                      "height": "sm",
                      "action": {
                        "type": "uri",
                        "label": "サイトへ",
                        "uri": "https://wakasa-ohashi.shop-pro.jp/"
                      }
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [],
                      "margin": "sm"
                    }
                  ],
                  "flex": 0
                }
              },
              {
                "type": "bubble",
                "hero": {
                  "type": "image",
                  "url": "https://p1-e6eeae93.imageflux.jp/c!/a=2,w=920,h=920,b=ffffff00,f=webp:auto/masutani-hamono/6efa6c969c2849f01ab4.jpg",
                  "size": "full",
                  "aspectRatio": "20:13",
                  "aspectMode": "cover",
                  "action": {
                    "type": "uri",
                    "uri": "https://masutani-hamono.shop/"
                  }
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "増谷刃物製作",
                      "weight": "bold",
                      "size": "3xl",
                      "align": "start",
                      "offsetBottom": "lg"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "margin": "lg",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "baseline",
                          "spacing": "sm",
                          "contents": [
                            {
                              "type": "text",
                              "text": "700年の歴史をもつ「越前打刃物」の伝統を、四代にわたり受け継いできた増谷刃物製作の包丁は、プロが使う包丁を家庭用包丁として製造しています。職人の手仕事から生まれる包丁は、薄くてコシがあり、丈夫でしなやか。スムーズな切れ味となめらかな切り口に、料理がどんどん楽しくなる。日々の「おいしい」のために…包丁しごとが、らくになるアイテムです。",
                              "color": "#aaaaaa",
                              "size": "sm",
                              "flex": 1,
                              "wrap": true,
                              "offsetBottom": "xs"
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  "borderWidth": "none"
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "button",
                      "style": "link",
                      "height": "sm",
                      "action": {
                        "type": "uri",
                        "label": "サイトへ",
                        "uri": "https://masutani-hamono.shop/"
                      }
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [],
                      "margin": "sm"
                    }
                  ],
                  "flex": 0
                }
              }
            ]
          }
        }
      ],
    };
    return await this.api.post("/bot/message/push", body);
  }
}
export { LineApi };
