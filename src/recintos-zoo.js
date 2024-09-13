class RecintosZoo {
    // tipo de especie
    especies = {
      LEAO: 'LEAO',
      LEOPARDO: 'LEOPARDO',
      CROCODILO: 'CROCODILO',
      MACACO: 'MACACO',
      GAZELA: 'GAZELA',
      HIPOPOTAMO: 'HIPOPOTAMO',
    };
  
    // tipo de bioma
    biomas = {
      SAVANA: 'savana',
      FLORESTA: 'floresta',
      RIO: 'rio',
    };
  
    // lista de carnivoro
    carnivoroList = [
      this.especies.LEAO,
      this.especies.LEOPARDO,
      this.especies.CROCODILO,
    ];
  
    // info de animal
    animais = {
      [this.especies.LEAO]: {
        tamanho: 3,
        biomaList: [this.biomas.SAVANA],
      },
      [this.especies.LEOPARDO]: {
        tamanho: 2,
        biomaList: [this.biomas.SAVANA],
      },
      [this.especies.CROCODILO]: {
        tamanho: 3,
        biomaList: [this.biomas.RIO],
      },
      [this.especies.MACACO]: {
        tamanho: 1,
        biomaList: [this.biomas.SAVANA, this.biomas.FLORESTA],
      },
      [this.especies.GAZELA]: {
        tamanho: 2,
        biomaList: [this.biomas.SAVANA],
      },
      [this.especies.HIPOPOTAMO]: {
        tamanho: 4,
        biomaList: [this.biomas.SAVANA, this.biomas.RIO],
      },
    };
  
    // info de recinto
    recintoList = [
      {
        biomaList: [this.biomas.SAVANA],
        tamanhoTotal: 10,
        animaisExistentes: [
          {
            quantidade: 3,
            animal: this.especies.MACACO,
          },
        ],
      },
      {
        biomaList: [this.biomas.FLORESTA],
        tamanhoTotal: 5,
        animaisExistentes: [],
      },
      {
        biomaList: [this.biomas.SAVANA, this.biomas.RIO],
        tamanhoTotal: 7,
        animaisExistentes: [
          {
            quantidade: 1,
            animal: this.especies.GAZELA,
          },
        ],
      },
      {
        biomaList: [this.biomas.RIO],
        tamanhoTotal: 8,
        animaisExistentes: [],
      },
      {
        biomaList: [this.biomas.SAVANA],
        tamanhoTotal: 9,
        animaisExistentes: [
          {
            quantidade: 1,
            animal: this.especies.LEAO,
          },
        ],
      },
    ];
  
    // funcao para calcular espaço livre
    calcularEspacoLivre(recinto, animal, quantidade) {
      let espacoOcupado = 0;
      let maisDeUmaEspecie = false;
      if (recinto.animaisExistentes.length === 0)
        return recinto.tamanhoTotal - quantidade * this.animais[animal].tamanho;
      recinto.animaisExistentes.forEach((animalExistente) => {
        espacoOcupado +=
          animalExistente.quantidade *
          this.animais[animalExistente.animal].tamanho;
        if (animalExistente.animal !== animal) maisDeUmaEspecie = true;
      });
  
      return (
        recinto.tamanhoTotal -
        espacoOcupado -
        maisDeUmaEspecie -
        quantidade * this.animais[animal].tamanho
      );
    }
  
    analisaRecintos(animal, quantidade) {
      const recintosViaveis = [];
      const isCarnivoro = this.carnivoroList.includes(animal);
      // verificar especie
      if (this.especies[animal] === undefined) {
        return { erro: 'Animal inválido' };
      }
      // verificar quantidade
      if (typeof quantidade !== 'number' || quantidade === 0) {
        return { erro: 'Quantidade inválida' };
      }
      // percorre recintos para verificar a disponibilidade
      this.recintoList.forEach((recinto, i) => {
        const isSameBioma = this.animais[animal].biomaList.some((bioma) =>
          recinto.biomaList.includes(bioma)
        );
        // bioma inadequado, proximo recinto
        if (!isSameBioma) return;
  
        let espacoLivre;
        // logica para canivoros
        console.log(isCarnivoro);
        if (isCarnivoro) {
          // carnivoro nao da mesma especie, proximo recinto
          if (
            recinto.animaisExistentes.length > 1 ||
            (recinto.animaisExistentes.length === 1 &&
              recinto.animaisExistentes[0].animal !== animal)
          )
            return;
          // carnivoro da mesma especie, calcula espaço
          espacoLivre = this.calcularEspacoLivre(recinto, animal, quantidade);
        } else {
          // existe carnivoro no recinto, proximo recinto
          if (
            recinto.animaisExistentes.length === 1 &&
            this.carnivoroList.includes(recinto.animaisExistentes[0].animal)
          )
            return;
          // Um macaco não se sente confortável sem outro animal no recinto, proximo recinto
          if (
            animal === this.especies.MACACO &&
            quantidade === 1 &&
            recinto.animaisExistentes.length === 0
          )
            return;
          if (animal === this.especies.HIPOPOTAMO) {
            // Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio
            if (
              recinto.animaisExistentes.length === 0 ||
              (recinto.biomaList.includes(this.biomas.SAVANA) &&
                recinto.biomaList.includes(this.biomas.RIO))
            )
              espacoLivre = this.calcularEspacoLivre(recinto, animal, quantidade);
            else return;
          }
          // para outros casos, calcula o espaço
          espacoLivre = this.calcularEspacoLivre(recinto, animal, quantidade);
        }
        if (espacoLivre < 0) return;
        recintosViaveis.push(
          `Recinto ${i + 1} (espaço livre: ${espacoLivre} total: ${
            recinto.tamanhoTotal
          })`
        );
      });
      if (recintosViaveis.length > 0) return { recintosViaveis };
      else {
        return { erro: 'Não há recinto viável' };
      }
    }
  }
  
  const recintos = new RecintosZoo();
  console.log(recintos.analisaRecintos('LEAO', 1));
  
  export { RecintosZoo as RecintosZoo };