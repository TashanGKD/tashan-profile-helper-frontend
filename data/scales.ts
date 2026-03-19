/** 閲忚〃瀹氫箟锛氬畬鏁寸増锛屼笌 digital-twin-bootstrap 淇濇寔涓€鑷?*/

export interface ScaleQuestion {
  id: string
  text: string
  dimension: string
  reverse?: boolean
}

export interface ScaleDimension {
  id: string
  name: string
  question_ids: string[]
}

export interface ScaleDefinition {
  id: string
  name: string
  description: string
  instructions: string
  min_val: number
  max_val: number
  min_label: string
  max_label: string
  questions: ScaleQuestion[]
  dimensions: ScaleDimension[]
  /** 'average' = 鍧囧€艰鍒? 'sum' = 姹傚拰璁″垎 */
  scoring: 'average' | 'sum'
}

// 鈹€鈹€ RCSS锛氱鐮旇鐭ラ鏍奸噺琛紙8 棰橈紝1-7 鍒嗭級鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export const RCSS_SCALE: ScaleDefinition = {
  id: 'rcss',
  name: '绉戠爺璁ょ煡椋庢牸閲忚〃 (RCSS)',
  description: '璇勪及浣犲湪绉戠爺涓殑鎬濈淮涔犳儻锛氬亸鍚戙€岃法棰嗗煙鏁村悎銆嶈繕鏄€屼笓涓氭繁鑰曘€嶃€傚叡 8 棰橈紝绾?3 鍒嗛挓銆?,
  instructions: '璇锋牴鎹綘鍦ㄧ鐮斾腑鐨勭湡瀹炲€惧悜锛屽浠ヤ笅闄堣堪璇勫垎銆?,
  min_val: 1,
  max_val: 7,
  min_label: '瀹屽叏涓嶅悓鎰?,
  max_label: '瀹屽叏鍚屾剰',
  questions: [
    { id: 'A1', text: '鎴戜範鎯簬鍦ㄩ潪鏈笓涓氱殑棰嗗煙涓鎵惧彲浠ヨ法鐣屼娇鐢ㄧ殑鐏垫劅鎴栨柟娉曘€?, dimension: 'integration' },
    { id: 'A2', text: '鍦ㄥ鐞嗙鐮旈殰纰嶆椂锛屾垜鍊惧悜浜庤烦鍑哄綋鍓嶅叿浣撻棶棰橈紝璇曞浘鏋勫缓涓€涓洿瀹忓ぇ銆佹洿閫氱敤鐨勭悊璁烘鏋舵垨妯″瀷銆?, dimension: 'integration' },
    { id: 'A3', text: '鎴戣涓鸿法瀛︾鐨?杩炴帴"鑳藉姏姣斿崟涓€瀛︾鐨?娣卞害"鍦ㄧ幇浠ｇ瀛︾爺绌朵腑鏇翠负绋€缂哄拰閲嶈銆?, dimension: 'integration' },
    { id: 'A4', text: '鎴戝€惧悜浜庡皢涓嶅悓鐨勭畻娉曘€佹ā鍨嬪拰鐞嗚"缁勮"鍦ㄤ竴璧凤紝褰㈡垚涓€濂楀畬鏁寸殑绯荤粺鎴栬В鍐虫柟妗堛€?, dimension: 'integration' },
    { id: 'B1', text: '鎴戞洿鍠滄娣辫€曚竴涓瀭鐩寸粏鍒嗛鍩燂紝鎴愪负閭ｄ釜棰嗗煙閲屾帉鎻℃妧鏈粏鑺傛渶绮惧噯銆佹渶鍏ㄩ潰鐨勪笓瀹躲€?, dimension: 'depth' },
    { id: 'B2', text: '鎴戞洿鍠滄閽堝鏌愪釜鍏蜂綋鐨勬ā鍨嬨€佹暟鎹泦鎴栫墿鐞嗙幇璞¤繘琛屾瀬鑷寸殑鍙傛暟璋冧紭銆佹暟瀛﹀缓妯℃垨瀹為獙楠岃瘉銆?, dimension: 'depth' },
    { id: 'B3', text: '鎴戞洿鍠滄涓€涓汉瀹夐潤鍦伴捇鐮旀瀬鍏跺鏉傜殑鏁板鎺ㄥ銆佷唬鐮佺粏鑺傛垨瀹為獙鎿嶄綔锛岃€屼笉鍠滄棰戠箒璁ㄨ瀹忚鏋舵瀯銆?, dimension: 'depth' },
    { id: 'B4', text: '鎴戣涓烘妸涓€浠舵妧鏈皬浜嬪仛鍒版瀬鑷寸殑"宸ュ尃绮剧"鏄鐮斿伐浣滆€呯殑鏈€楂樺噯鍒欍€?, dimension: 'depth' },
  ],
  dimensions: [
    { id: 'integration', name: '妯悜鏁村悎', question_ids: ['A1', 'A2', 'A3', 'A4'] },
    { id: 'depth', name: '鍨傜洿娣卞害', question_ids: ['B1', 'B2', 'B3', 'B4'] },
  ],
  scoring: 'sum',
}

// 鈹€鈹€ Mini-IPIP锛氬ぇ浜斾汉鏍奸噺琛紙20 棰橈紝1-5 鍒嗭級鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export const MINI_IPIP_SCALE: ScaleDefinition = {
  id: 'mini-ipip',
  name: '澶т簲浜烘牸閲忚〃 (Mini-IPIP)',
  description: '璇勪及浣犵殑浜斿ぇ浜烘牸鐗硅川锛氬鍚戞€с€佸疁浜烘€с€佸敖璐ｆ€с€佺缁忚川銆佸紑鏀炬€с€傚叡 20 棰橈紝绾?5 鍒嗛挓銆?,
  instructions: '璇锋弿杩颁綘銆岄€氬父鐨勭姸鎬併€嶏紝鑰岄潪鐞嗘兂鐘舵€併€?,
  min_val: 1,
  max_val: 5,
  min_label: '闈炲父涓嶇鍚?,
  max_label: '闈炲父绗﹀悎',
  questions: [
    { id: '1',  text: '鎴戞槸鑱氫細涓殑鐒︾偣浜虹墿銆?,          dimension: 'E' },
    { id: '2',  text: '鎴戝悓鎯呬粬浜虹殑鎰熷彈銆?,              dimension: 'A' },
    { id: '3',  text: '鎴戜細绔嬪嵆瀹屾垚鏉傚姟銆?,              dimension: 'C' },
    { id: '4',  text: '鎴戞儏缁尝鍔ㄩ绻併€?,                dimension: 'N' },
    { id: '5',  text: '鎴戞湁鐢熷姩鐨勬兂璞″姏銆?,              dimension: 'I' },
    { id: '6',  text: '鎴戜笉甯歌璇濄€?,                   dimension: 'E', reverse: true },
    { id: '7',  text: '鎴戝鍒汉鐨勯棶棰樹笉鎰熷叴瓒ｃ€?,        dimension: 'A', reverse: true },
    { id: '8',  text: '鎴戠粡甯稿繕璁版妸涓滆タ鏀惧洖鍘熷銆?,      dimension: 'C', reverse: true },
    { id: '9',  text: '鎴戝ぇ閮ㄥ垎鏃堕棿閮藉緢鏀炬澗銆?,          dimension: 'N', reverse: true },
    { id: '10', text: '鎴戝鎶借薄姒傚康涓嶆劅鍏磋叮銆?,          dimension: 'I', reverse: true },
    { id: '11', text: '鍦ㄨ仛浼氫笂鎴戜細涓庤澶氫笉鍚岀殑浜轰氦璋堛€?, dimension: 'E' },
    { id: '12', text: '鎴戣兘鎰熷彈鍒颁粬浜虹殑鎯呯华銆?,          dimension: 'A' },
    { id: '13', text: '鎴戝枩娆㈡湁鏉＄悊銆?,                  dimension: 'C' },
    { id: '14', text: '鎴戝緢瀹规槗蹇冪儲鎰忎贡銆?,              dimension: 'N' },
    { id: '15', text: '鎴戠悊瑙ｆ娊璞℃蹇垫湁鍥伴毦銆?,          dimension: 'I', reverse: true },
    { id: '16', text: '鎴戜繚鎸佸湪鑳屾櫙涓紙涓嶅紩浜烘敞鐩級銆?,  dimension: 'E', reverse: true },
    { id: '17', text: '鎴戝浠栦汉涓嶅お鎰熷叴瓒ｃ€?,            dimension: 'A', reverse: true },
    { id: '18', text: '鎴戞妸浜嬫儏鎼炲緱涓€鍥㈢碂銆?,            dimension: 'C', reverse: true },
    { id: '19', text: '鎴戝緢灏戞劅鍒板咖閮併€?,                dimension: 'N', reverse: true },
    { id: '20', text: '鎴戞病鏈夊緢濂界殑鎯宠薄鍔涖€?,            dimension: 'I', reverse: true },
  ],
  dimensions: [
    { id: 'E', name: '澶栧悜鎬?,    question_ids: ['1', '6', '11', '16'] },
    { id: 'A', name: '瀹滀汉鎬?,    question_ids: ['2', '7', '12', '17'] },
    { id: 'C', name: '灏借矗鎬?,    question_ids: ['3', '8', '13', '18'] },
    { id: 'N', name: '绁炵粡璐?,    question_ids: ['4', '9', '14', '19'] },
    { id: 'I', name: '寮€鏀炬€?鏅哄姏', question_ids: ['5', '10', '15', '20'] },
  ],
  scoring: 'average',
}

// 鈹€鈹€ AMS-GSR 28锛氬鏈姩鏈洪噺琛紙28 棰橈紝1-7 鍒嗭級鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export const AMS_SCALE: ScaleDefinition = {
  id: 'ams',
  name: '瀛︽湳鍔ㄦ満閲忚〃 (AMS-GSR 28)',
  description: '璇勪及浣犱粠浜嬬鐮旂殑鍔ㄦ満缁撴瀯锛氬唴鍦ㄥ姩鏈恒€佸鍦ㄥ姩鏈哄拰鏃犲姩鏈恒€傚叡 28 棰橈紝绾?8 鍒嗛挓銆?,
  instructions: '璇锋牴鎹?浣犱负浠€涔堟敾璇荤爺绌剁敓瀛︿綅骞朵粠浜嬬鐮斿伐浣滐紵"鏉ュ洖绛斻€?,
  min_val: 1,
  max_val: 7,
  min_label: '瀹屽叏涓嶇鍚?,
  max_label: '闈炲父绗﹀悎',
  questions: [
    { id: '1',  text: '鍥犱负浠呮湁鏈瀛﹀巻锛屾垜浠ュ悗鎵句笉鍒伴珮钖伐浣溿€?,                             dimension: 'external' },
    { id: '2',  text: '鍥犱负鍦ㄨ嚜宸辩殑棰嗗煙瀛︿範鏂颁簨鐗╂椂鎴戣兘浣撻獙鍒板揩涔愬拰婊¤冻銆?,                  dimension: 'know' },
    { id: '3',  text: '鍥犱负鎴戣涓虹爺绌剁敓鏁欒偛鑳藉府鍔╂垜鏇村ソ鍦颁负閫夋嫨鐨勮亴涓氬仛鍑嗗銆?,              dimension: 'identified' },
    { id: '4',  text: '鍥犱负褰撲笌浠栦汉浜ゆ祦鑷繁鐨勭爺绌舵兂娉曟椂鎴戜綋楠屽埌寮虹儓鐨勬劅鍙椼€?,                dimension: 'stimulation' },
    { id: '5',  text: '璇村疄璇濓紝鎴戜笉鐭ラ亾锛涙垜鐪熺殑瑙夊緱璇荤爺绌剁敓鏄氮璐规椂闂淬€?,                    dimension: 'amotivation' },
    { id: '6',  text: '鍥犱负鍦ㄧ爺绌朵腑瓒呰秺鑷垜鏃舵垜鑳戒綋楠屽埌鎰夋偊銆?,                              dimension: 'accomplishment' },
    { id: '7',  text: '涓轰簡鍚戣嚜宸辫瘉鏄庢垜鏈夎兘鍔涘畬鎴愮爺绌剁敓瀛︿綅銆?,                              dimension: 'introjected' },
    { id: '8',  text: '涓轰簡鏃ュ悗鑳藉湪瀛︽湳鐣屾垨浜т笟鐣岃幏寰楁洿鏈夊０鏈涚殑鑱屼綅銆?,                      dimension: 'external' },
    { id: '9',  text: '鍥犱负鍙戠幇鍓嶆墍鏈鐨勬柊鐜拌薄鎴栨柊瑙傜偣鏃舵垜鑳戒綋楠屽埌鎰夋偊銆?,                  dimension: 'know' },
    { id: '10', text: '鍥犱负杩欐渶缁堣兘浣挎垜杩涘叆鎴戝枩娆㈢殑棰嗗煙灏变笟銆?,                              dimension: 'identified' },
    { id: '11', text: '鍥犱负闃呰鏈夎叮鐨勫鏈鏂囨垨钁椾綔鏃舵垜鑳戒綋楠屽埌鎰夋偊銆?,                      dimension: 'stimulation' },
    { id: '12', text: '鎴戞浘缁忔湁鍏呭垎鐨勭悊鐢辫鐮旂┒鐢燂紱鐒惰€岋紝鐜板湪鎴戞€€鐤戞槸鍚﹀簲璇ョ户缁€?,          dimension: 'amotivation' },
    { id: '13', text: '鍥犱负鍦ㄧ爺绌舵垚灏变腑瓒呰秺鑷垜鏃舵垜鑳戒綋楠屽埌蹇箰銆?,                          dimension: 'accomplishment' },
    { id: '14', text: '鍥犱负褰撴垜鍦ㄧ爺绌朵腑鍙栧緱鎴愬姛鏃讹紝鎴戜細鎰熷埌鑷繁寰堥噸瑕併€?,                    dimension: 'introjected' },
    { id: '15', text: '鍥犱负鎴戞兂鏃ュ悗鎷ユ湁"缇庡ソ鐢熸椿"銆?,                                        dimension: 'external' },
    { id: '16', text: '鍥犱负鎷撳鎴戞劅鍏磋叮鐮旂┒涓婚鐨勭煡璇嗘椂鎴戣兘浣撻獙鍒版剦鎮︺€?,                    dimension: 'know' },
    { id: '17', text: '鍥犱负杩欒兘甯姪鎴戝氨鐮旂┒鏂瑰悜鍜岃亴涓氬畾浣嶅仛鍑烘洿濂界殑閫夋嫨銆?,                  dimension: 'identified' },
    { id: '18', text: '鍥犱负鍏ㄧ璐敞浜庢煇浜涘鑰呯殑钁椾綔鏃舵垜鑳戒綋楠屽埌鎰夋偊銆?,                      dimension: 'stimulation' },
    { id: '19', text: '鎴戜笉鏄庣櫧涓轰粈涔堝仛绉戠爺锛屽潶鐜囧湴璇达紝鎴戞牴鏈笉鍦ㄤ箮銆?,                      dimension: 'amotivation' },
    { id: '20', text: '鍥犱负瀹屾垚鍥伴毦鐨勭爺绌朵换鍔¤繃绋嬩腑鎴戣兘鎰熷埌婊¤冻銆?,                          dimension: 'accomplishment' },
    { id: '21', text: '涓轰簡鍚戣嚜宸卞睍绀烘垜鏄竴涓仾鏄庝笖鏈夎兘鍔涚殑鐮旂┒鑰呫€?,                        dimension: 'introjected' },
    { id: '22', text: '涓轰簡鏃ュ悗鑳芥湁鏇村ソ鐨勮亴涓氬墠鏅拰钖按銆?,                                  dimension: 'external' },
    { id: '23', text: '鍥犱负鎴戠殑鐮旂┒鐢熷涔犱娇鎴戣兘缁х画浜嗚В璁稿鎴戞劅鍏磋叮鐨勪簨鐗┿€?,                dimension: 'know' },
    { id: '24', text: '鍥犱负鎴戠浉淇￠澶栧嚑骞寸殑鐮旂┒鐢熸暀鑲蹭細鎻愰珮鎴戜綔涓虹爺绌惰€呯殑鑳藉姏銆?,            dimension: 'identified' },
    { id: '25', text: '鍥犱负鎺㈢储鍚勭鏈夎叮鐨勭爺绌朵富棰樻椂鎴戣兘浣撻獙鍒?鍏村"鐨勬劅瑙夈€?,                dimension: 'stimulation' },
    { id: '26', text: '鎴戜笉鐭ラ亾锛涙垜鏃犳硶鐞嗚В鎴戝湪鐮旂┒涓仛浠€涔堛€?,                              dimension: 'amotivation' },
    { id: '27', text: '鍥犱负鐮旂┒鐢熷涔犱娇鎴戝湪杩芥眰鐮旂┒鍗撹秺鐨勮繃绋嬩腑浣撻獙鍒颁釜浜烘弧瓒虫劅銆?,          dimension: 'accomplishment' },
    { id: '28', text: '鍥犱负鎴戞兂鍚戣嚜宸卞睍绀烘垜鑳藉湪鐮旂┒鐢熷涔犲拰鐮旂┒涓彇寰楁垚鍔熴€?,                dimension: 'introjected' },
  ],
  dimensions: [
    { id: 'know',          name: '姹傜煡鍐呭湪鍔ㄦ満',     question_ids: ['2', '9', '16', '23'] },
    { id: 'accomplishment',name: '鎴愬氨鍐呭湪鍔ㄦ満',     question_ids: ['6', '13', '20', '27'] },
    { id: 'stimulation',   name: '浣撻獙鍒烘縺鍐呭湪鍔ㄦ満', question_ids: ['4', '11', '18', '25'] },
    { id: 'identified',    name: '璁ゅ悓璋冭妭',         question_ids: ['3', '10', '17', '24'] },
    { id: 'introjected',   name: '鍐呮憚璋冭妭',         question_ids: ['7', '14', '21', '28'] },
    { id: 'external',      name: '澶栭儴璋冭妭',         question_ids: ['1', '8', '15', '22'] },
    { id: 'amotivation',   name: '鏃犲姩鏈?,           question_ids: ['5', '12', '19', '26'] },
  ],
  scoring: 'average',
}

export const ALL_SCALES: ScaleDefinition[] = [RCSS_SCALE, MINI_IPIP_SCALE, AMS_SCALE]

export function getScaleById(id: string): ScaleDefinition | undefined {
  return ALL_SCALES.find((s) => s.id === id)
}
