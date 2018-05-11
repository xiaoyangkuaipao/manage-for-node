/**
 * Created by oxygen on 2017/11/21.
 */

 const express = require('express');
 const https = require('https');
 const router = express.Router();
 const sha1 = require('sha1');

 router.get('/wx-config', (req, res) => {
    var accessToken = '';

    // https.get(
    //   'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx3b70375e1032772b&secret=1eed9e772a2d31dbbd61d141359d2fd6',
    //   (backData) => {
    //     backData.on('data', (d) => {
    //       process.stdout.write(d);
    //       accessToken = JSON.parse(d)['access-token'];
    //       res.send(d);
    //     })
    //   }
    // )

    // https.get(
    //   'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+'nerLkuhbRoyqxHyymQJ4jDKyZ3bTRZDxZUzax1t7Qza4mAztP7a80zv43F4QNSxch1H8Wk1Lz-nkCFr25eo1kweZ3tNGVWgYEPev8qfH78uCC6DH-NeU0bOc6hwDoERDCBZfAGAONL'+'&type=jsapi',
    //   (back) => {
    //     back.on('data', (d) => {
    //       res.send(d);
    //     })
    //   }
    // )

    var ticket = "HoagFKDcsGMVCIY2vOjf9jLxE_JLpVLSHPyFjuyYKv9x69QUHHkyUZEpl5vfMs4FBnH86bOC0Whhpvtyw-CsVA"

    const createNonceStr = () => Math.random().toString(36).substr(2, 15);
    const createTimeStamp = () => parseInt(new Date().getTime() / 1000) + '';
    const calcSignature = function (ticket, noncestr, ts, url) {
       var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;
       shaObj = sha1(str);
       return shaObj;
    }

    const noncestr = createNonceStr();
    const timestamp = createTimeStamp();
    const signature = calcSignature(ticket, noncestr, timestamp, 'http://yangqi.site:1338/');

    res.send({
      noncestr: noncestr,
      timestamp: timestamp,
      signature: signature,
    })

 })

 module.exports = router;
