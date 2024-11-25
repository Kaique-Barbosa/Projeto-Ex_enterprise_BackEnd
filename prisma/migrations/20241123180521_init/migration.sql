/*
  Warnings:

  - You are about to drop the column `sobrenome` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataNascimento` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_telefone_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `sobrenome`,
    ADD COLUMN `ativo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `cpf` VARCHAR(191) NOT NULL,
    ADD COLUMN `dataCadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dataNascimento` DATETIME(3) NOT NULL,
    MODIFY `telefone` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_cpf_key` ON `User`(`cpf`);
