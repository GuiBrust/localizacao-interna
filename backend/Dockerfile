FROM node:20.10.0-alpine3.19

RUN apk add --update --no-cache git py3-pygments zsh zsh-vcs && \
    sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)" && \
    git clone https://github.com/zsh-users/zsh-autosuggestions.git "/root/.oh-my-zsh/custom/plugins/zsh-autosuggestions" && \
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git "/root/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting" && \
    git clone https://github.com/spaceship-prompt/spaceship-prompt.git "/root/.oh-my-zsh/custom/themes/spaceship-prompt" --depth=1 && \
    ln -s "/root/.oh-my-zsh/custom/themes/spaceship-prompt/spaceship.zsh-theme" "/root/.oh-my-zsh/custom/themes/spaceship.zsh-theme"

WORKDIR /app

EXPOSE 3333

CMD ["yarn", "dev"]