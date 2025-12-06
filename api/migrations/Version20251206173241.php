<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251206173241 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE icon (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, type VARCHAR(50) NOT NULL, image_url VARCHAR(255) DEFAULT NULL, background_color VARCHAR(7) DEFAULT NULL, url VARCHAR(500) DEFAULT NULL, position INT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, parent_id INT DEFAULT NULL, user_id INT NOT NULL, INDEX IDX_659429DB727ACA70 (parent_id), INDEX IDX_659429DBA76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE icon ADD CONSTRAINT FK_659429DB727ACA70 FOREIGN KEY (parent_id) REFERENCES icon (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE icon ADD CONSTRAINT FK_659429DBA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE icon DROP FOREIGN KEY FK_659429DB727ACA70');
        $this->addSql('ALTER TABLE icon DROP FOREIGN KEY FK_659429DBA76ED395');
        $this->addSql('DROP TABLE icon');
        $this->addSql('DROP TABLE `user`');
    }
}
