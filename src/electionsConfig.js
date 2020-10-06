const electionsConfig = {
    cutoff: 7,
    totalChairs: 120,
    maxChairsForParty: 65,
    parties: ["Биримдик", 
              "Мекенчил", 
              "Ыйман Нуру", 
              "Мекеним Кыргызстан", 
              "Реформа", 
              "Ата Мекен", 
              "Замандаш", 
              "Бутун Кыргызстан", 
              "Социал-демократы", 
              "Мекен Ынтымагы", 
              "Политическая партия ветеранов войны в Афганистане и участников других боевых конфликтов", 
              "Ордо", 
              "Бир Бол", 
              "Республика", 
              "Кыргызстан", 
              "Чон казат", 
              "Против всех"],
    against_all_cutoff: "50",
    against_all_message: "Пока процент голосов против всех не достигнет барьера, это эти голоса по сути только помогают лидирующим партиям получить больше мест. Барьер того, чтобы голоса против всех начали влиять на что-то равен ",
    cutoff_message: "Партия не получит мест в парламенте пока не преодолеет барьер в ",
    against_all_reached_message: "",
    distribute_all_votes_message: "Распределите 100% голосов между партиями, чтобы увидеть, какая партия получит сколько мест в парламенте",
    one_party_cutoff_only_message: "Сценарий, при котором только одна партия набирает больше 7 процентов, не учтён в законодательстве Кыргызстана. При этом исходе скорее всего будут объявлены перевыборы, если только действующий парламент не решит иначе"
  }

export default electionsConfig